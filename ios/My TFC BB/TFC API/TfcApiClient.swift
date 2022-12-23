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

class TfcApi {

    static private var clientAndChannel: (TfcApiClient, ChannelProvider)?

    private class ChannelProvider {
        private let group: EventLoopGroup
        let connection: ClientConnection

        fileprivate init() throws {
            group = PlatformSupport.makeEventLoopGroup(loopCount: 1)
            connection = ClientConnection
                .usingPlatformAppropriateTLS(for: group)
                .connect(host: TFC_API_HOST, port: TFC_API_PORT)

//            GRPCChannelPool.Configuration.with(target: .host(TFC_API_HOST), transportSecurity: .tls(), eventLoopGroup: )
        }

        deinit {
            try? group.syncShutdownGracefully()
        }
    }

    static var client: TfcApiClient {
        if let c = clientAndChannel { return c.0 }
        let channelProvider = try! ChannelProvider()
        let client = TfcApiClient(channel: channelProvider.connection, interceptors: InteceptorFactory())
        clientAndChannel = (client, channelProvider)
        return client
    }
}

struct InteceptorFactory: MyTfcBb_V1_MyTfcClientInterceptorFactoryProtocol {
    func makeLogInInterceptors() -> [GRPC.ClientInterceptor<MyTfcBb_V1_LogInRequest, MyTfcBb_V1_LogInResponse>] {
        return []
    }

    func makeGetDeliveriesInterceptors() -> [GRPC.ClientInterceptor<MyTfcBb_V1_GetDeliveriesRequest, MyTfcBb_V1_GetDeliveriesResponse>] {
        return defaultInteceptors()
    }

    func makeUpdatePushTokenInterceptors() -> [GRPC.ClientInterceptor<MyTfcBb_V1_UpdatePushTokenRequest, SwiftProtobuf.Google_Protobuf_Empty>] {
        return defaultInteceptors()
    }

    func makeSendTestPushNoticationInterceptors() -> [GRPC.ClientInterceptor<SwiftProtobuf.Google_Protobuf_Empty, SwiftProtobuf.Google_Protobuf_Empty>] {
        return defaultInteceptors()
    }

    func makeLogOutInterceptors() -> [GRPC.ClientInterceptor<SwiftProtobuf.Google_Protobuf_Empty, SwiftProtobuf.Google_Protobuf_Empty>] {
        return defaultInteceptors()
    }

    private func defaultInteceptors<Request, Response>() -> [ClientInterceptor<Request, Response>] {
//        return [AuthInterceptor(), UnauthenticatedInteceptor()]
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

class UnauthenticatedInteceptor<Request, Response>: ClientInterceptor<Request, Response> {
    override func receive(_ part: GRPCClientResponsePart<Response>, context: ClientInterceptorContext<Request, Response>) {
        defer { context.receive(part) }

        guard case let .end(status, _) = part, status.code == GRPCStatus.Code.unauthenticated else {
            return
        }

            let topViewController: UIViewController = {
                let root = SceneDelegate.shared.window!.rootViewController!
                var topViewController = root

                while let presentedVC = topViewController.presentedViewController {
                    topViewController = presentedVC
                }

                return topViewController
            }()


            let alert = UIAlertController(title: "Authentication problem 😕", message: "There's a problem with your log in details (perhaps you changed your password?).\n\nPlease log in again.", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "Okay", style: .cancel, handler: { _ in
                SceneDelegate.shared.logedOut()
            }))
            topViewController.present(alert, animated: true)
    }
}
