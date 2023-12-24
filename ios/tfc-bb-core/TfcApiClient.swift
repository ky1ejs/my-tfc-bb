//
//  TfcApiClient.swift
//  My TFC BB
//
//  Created by Kyle Satti on 11/30/22.
//

import Foundation
import GRPC
import NIO
import SwiftProtobuf
import UIKit

public enum AuthenticationState {
    case authenticated, notAuthenticated
}

public class TfcApi {
    @Published public fileprivate(set) var authenticationState: AuthenticationState
    @Published public fileprivate(set) var latestDeliveryCount = 0

    static private var clientAndChannel: (TfcApiClient, ChannelProvider)?

    init() throws {
        authenticationState = try KeychainManager.getBackendAssignedId() != nil ? .authenticated : .notAuthenticated
    }

    private class ChannelProvider {
        private let group: EventLoopGroup
        let connection: ClientConnection

        fileprivate init() throws {
            group = PlatformSupport.makeEventLoopGroup(loopCount: 1)
            #if LOCALHOST_API
            connection = ClientConnection
                .insecure(group: group)
                .connect(host: "0.0.0.0", port: 3000)
            #elseif PRODUCTION_API
            connection = ClientConnection
                .usingPlatformAppropriateTLS(for: group)
                .connect(host: "my-tfc-bb.fly.dev", port: 443)
            #endif
        }

        deinit {
            try? group.syncShutdownGracefully()
        }
    }

    public var client: TfcApiClient {
        if let c = type(of: self).clientAndChannel { return c.0 }
        let channelProvider = try! ChannelProvider()
        let client = TfcApiClient(channel: channelProvider.connection, interceptors: InteceptorFactory())
        type(of: self).clientAndChannel = (client, channelProvider)
        return client
    }

    public static var shared = try! TfcApi()

    public func getUncollectedDeliveryCount() async throws -> PersistedData {
        if let cacheHit = DataStorage.readData(), cacheHit.lastUpdate.timeIntervalSince(.now) > 60 * 5 {
            return cacheHit
        }

        let response = try await client.getDeliveries(MyTfcBb_V1_GetDeliveriesRequest())
        return CacheWriter.writeCacheUpdate(uncollectedCount: Int(response.uncollectedCount))
    }
}

struct InteceptorFactory: MyTfcBb_V1_MyTfcClientInterceptorFactoryProtocol {
    func makeLogInInterceptors() -> [GRPC.ClientInterceptor<MyTfcBb_V1_LogInRequest, MyTfcBb_V1_LogInResponse>] {
        return []
    }

    func makeGetDeliveriesInterceptors() -> [GRPC.ClientInterceptor<MyTfcBb_V1_GetDeliveriesRequest, MyTfcBb_V1_GetDeliveriesResponse>] {
        return defaultInteceptors() + [DeliveriesInteceptor()]
    }

    func makeUpdatePushTokenInterceptors() -> [GRPC.ClientInterceptor<MyTfcBb_V1_UpdatePushTokenRequest, SwiftProtobuf.Google_Protobuf_Empty>] {
        return [AuthInterceptor()]
    }

    func makeSendTestPushNoticationInterceptors() -> [GRPC.ClientInterceptor<SwiftProtobuf.Google_Protobuf_Empty, SwiftProtobuf.Google_Protobuf_Empty>] {
        return defaultInteceptors()
    }

    func makeLogOutInterceptors() -> [GRPC.ClientInterceptor<SwiftProtobuf.Google_Protobuf_Empty, SwiftProtobuf.Google_Protobuf_Empty>] {
        return defaultInteceptors()
    }

    func makeGetDevicesInterceptors() -> [ClientInterceptor<Google_Protobuf_Empty, MyTfcBb_V1_GetDevicesResponse>] {
        return defaultInteceptors()
    }

    func makeRemoveDeviceInterceptors() -> [ClientInterceptor<MyTfcBb_V1_RemoveDeviceRequest, Google_Protobuf_Empty>] {
        return defaultInteceptors()
    }

    private func defaultInteceptors<Request, Response>() -> [ClientInterceptor<Request, Response>] {
        return [AuthInterceptor(), UnauthenticatedInteceptor()]
    }
}

class AuthInterceptor<Request, Response>: ClientInterceptor<Request, Response> {
    override func send(_ part: GRPCClientRequestPart<Request>, promise: EventLoopPromise<Void>?, context: ClientInterceptorContext<Request, Response>) {
        do {
            guard case .metadata(var hPACKHeaders) = part, let token = try KeychainManager.getBackendAssignedId() else {
                context.send(part, promise: promise)
                return
            }
            hPACKHeaders.add(name: "device_id", value: token)
            context.send(.metadata(hPACKHeaders), promise: promise)
        } catch {
            context.errorCaught(error)
        }
    }
}

class UnauthenticatedInteceptor<Request, Response>: ClientInterceptor<Request, Response> {
    override func receive(_ part: GRPCClientResponsePart<Response>, context: ClientInterceptorContext<Request, Response>) {
        defer { context.receive(part) }

        guard case let .end(status, _) = part, status.code == GRPCStatus.Code.unauthenticated else {
            return
        }

        TfcApi.shared.authenticationState = .notAuthenticated
    }
}

class DeliveriesInteceptor: ClientInterceptor<MyTfcBb_V1_GetDeliveriesRequest, MyTfcBb_V1_GetDeliveriesResponse> {
    override func receive(_ part: GRPCClientResponsePart<MyTfcBb_V1_GetDeliveriesResponse>, context: ClientInterceptorContext<MyTfcBb_V1_GetDeliveriesRequest, MyTfcBb_V1_GetDeliveriesResponse>) {
        defer { context.receive(part) }

        guard case let .message(response) = part else { return }

        let uncollectedCount = Int(response.uncollectedCount)
        TfcApi.shared.latestDeliveryCount = uncollectedCount
        CacheWriter.writeCacheUpdate(uncollectedCount: uncollectedCount)

    }
}

private struct CacheWriter {
    @discardableResult
    static func writeCacheUpdate(uncollectedCount: Int) -> PersistedData {
        let persistedData = PersistedData(lastUpdate: .now, deliveriesCount: Int(uncollectedCount))
        DataStorage.write(persistedData)
        return persistedData
    }
}
