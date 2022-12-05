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

class TfcApi {

    static private var clientAndChannel: (TfcApiClient, ChannelProvider)?

    private class ChannelProvider {
        private let group: EventLoopGroup
        let channel: GRPCChannel

        fileprivate init() throws {
            group = PlatformSupport.makeEventLoopGroup(loopCount: 1)
            channel = try GRPCChannelPool.with(
              target: .host(TFC_API_HOST, port: TFC_API_PORT),
              transportSecurity: .plaintext,
              eventLoopGroup: group
            )
        }

        deinit {
            try? group.syncShutdownGracefully()
        }
    }

    static var client: TfcApiClient {
        if let c = clientAndChannel { return c.0 }
        let channelProvider = try! ChannelProvider()
        let client = TfcApiClient(channel: channelProvider.channel, interceptors: InteceptorFactory())
        clientAndChannel = (client, channelProvider)
        return client
    }
}

struct InteceptorFactory: Services_Mytfcbb_V1_MyTfcClientInterceptorFactoryProtocol {
    func makeLogInInterceptors() -> [GRPC.ClientInterceptor<Services_Mytfcbb_V1_LogInRequest, Services_Mytfcbb_V1_LogInResponse>] {
        return []
    }

    func makeGetDeliveriesInterceptors() -> [GRPC.ClientInterceptor<Services_Mytfcbb_V1_GetDeliveriesRequest, Services_Mytfcbb_V1_GetDeliveriesResponse>] {
        return [AuthInterceptor()]
    }

    func makeUpdatePushTokenInterceptors() -> [GRPC.ClientInterceptor<Services_Mytfcbb_V1_UpdatePushTokenRequest, SwiftProtobuf.Google_Protobuf_Empty>] {
        return [AuthInterceptor()]
    }

    func makeSendTestPushNoticationInterceptors() -> [GRPC.ClientInterceptor<SwiftProtobuf.Google_Protobuf_Empty, SwiftProtobuf.Google_Protobuf_Empty>] {
        return [AuthInterceptor()]
    }

    func makeLogOutInterceptors() -> [GRPC.ClientInterceptor<SwiftProtobuf.Google_Protobuf_Empty, SwiftProtobuf.Google_Protobuf_Empty>] {
        return [AuthInterceptor()]
    }
}

class AuthInterceptor<Request, Response>: ClientInterceptor<Request, Response> {
    override func send(_ part: GRPCClientRequestPart<Request>, promise: EventLoopPromise<Void>?, context: ClientInterceptorContext<Request, Response>) {
        guard case .metadata(var hPACKHeaders) = part, let token = KeychainManager.getBackendAssignedId() else {
            context.send(part, promise: promise)
            return
        }

        hPACKHeaders.add(name: "device_id", value: token)
        context.send(.metadata(hPACKHeaders), promise: promise)
    }
}
