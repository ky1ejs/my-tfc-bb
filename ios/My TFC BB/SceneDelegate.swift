//
//  SceneDelegate.swift
//  My TFC BB
//
//  Created by Kyle Satti on 10/31/22.
//

import UIKit
import SwiftUI
import tfc_bb_core

class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?

    static var shared: SceneDelegate? {
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene else {
            return nil
        }
        return windowScene.delegate as? SceneDelegate
    }


    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        // Use this method to optionally configure and attach the UIWindow `window` to the provided UIWindowScene `scene`.
        // If using a storyboard, the `window` property will automatically be initialized and attached to the scene.
        // This delegate does not imply the connecting scene or session are new (see `application:configurationForConnectingSceneSession` instead).
        guard let scene = (scene as? UIWindowScene) else { return }

        let rootViewController: UIViewController = {
            if KeychainManager.getBackendAssignedId() == nil {
                return UIHostingController(rootView: LogInView())
            } else {
                return UIHostingController(rootView: DeliveriesView(provider: DeliveriesFetcher()))
            }
        }()

        let window = UIWindow(windowScene: scene)
        window.rootViewController = rootViewController
        window.makeKeyAndVisible()
        self.window = window
    }

    func authenticated() {
        animate(to: UIHostingController(rootView: DeliveriesView(provider: DeliveriesFetcher())))
    }

    func logedOut() {
        animate(to: UIHostingController(rootView: LogInView()))
        UNUserNotificationCenter.current().setBadgeCount(0)
    }

    private func animate(to newRootViewController: UIViewController) {
        window!.rootViewController = newRootViewController
        UIView.transition(with: window!, duration: 0.3, options: .transitionCrossDissolve, animations: {})
    }
}

