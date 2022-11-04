//
//  SceneDelegate.swift
//  My TFC BB
//
//  Created by Kyle Satti on 10/31/22.
//

import UIKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?


    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        // Use this method to optionally configure and attach the UIWindow `window` to the provided UIWindowScene `scene`.
        // If using a storyboard, the `window` property will automatically be initialized and attached to the scene.
        // This delegate does not imply the connecting scene or session are new (see `application:configurationForConnectingSceneSession` instead).
        guard let scene = (scene as? UIWindowScene) else { return }

        let rootViewController: UIViewController = {
            if KeychainManager.getBackendAssignedId() == nil {
                return LogInViewController()
            } else {
                return DeliveresViewController()
            }
        }()

        let window = UIWindow(windowScene: scene)
        window.rootViewController = UINavigationController(rootViewController: rootViewController)
        window.makeKeyAndVisible()
        self.window = window
    }

    func authenticated() {
        let vc = DeliveresViewController()
        window!.rootViewController = UINavigationController(rootViewController: vc)
        UIView.transition(with: window!, duration: 0.3, options: .transitionCrossDissolve, animations: {})
    }

}

