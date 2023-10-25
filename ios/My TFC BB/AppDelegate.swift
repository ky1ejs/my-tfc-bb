//
//  AppDelegate.swift
//  My TFC BB
//
//  Created by Kyle Satti on 10/31/22.
//

import UIKit
import tfc_bb_core
import Combine
import WidgetKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    private var bag: Set<AnyCancellable>?


    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        UNUserNotificationCenter.current().delegate = self

        let authenticationSub = TfcApi.shared.$authenticationState.sink { status in
            guard status == .notAuthenticated else { return }
            DispatchQueue.main.async {
                guard let sceneDelegate = SceneDelegate.shared else { return }
                guard let rootController = sceneDelegate.window?.rootViewController else { return }

                let topViewController: UIViewController = {
                    var topViewController = rootController

                    while let presentedVC = topViewController.presentedViewController {
                        topViewController = presentedVC
                    }

                    return topViewController
                }()


                let alert = UIAlertController(title: "Authentication problem 😕", message: "There's a problem with your log in details (perhaps you changed your password?).\n\nPlease log in again.", preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "Okay", style: .cancel, handler: { _ in
                    sceneDelegate.logedOut()
                }))
                topViewController.present(alert, animated: true)
            }
        }

        let notificationSub = TfcApi.shared.$latestDeliveryCount.sink { deliveryCount in
            DispatchQueue.main.async {
                UNUserNotificationCenter.current().setBadgeCount(Int(deliveryCount))
            }
        }

        bag?.insert(authenticationSub)
        bag?.insert(notificationSub)

        return true
    }

    // MARK: UISceneSession Lifecycle

    func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        // Called when a new scene session is being created.
        // Use this method to select a configuration to create the new scene with.
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }

    func application(_ application: UIApplication, didDiscardSceneSessions sceneSessions: Set<UISceneSession>) {
        // Called when the user discards a scene session.
        // If any sessions were discarded while the application was not running, this will be called shortly after application:didFinishLaunchingWithOptions.
        // Use this method to release any resources that were specific to the discarded scenes, as they will not return.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        UNUserNotificationCenter.current().getNotificationSettings { settings in
            guard settings.authorizationStatus == .authorized else { return }
            DispatchQueue.main.async {
              UIApplication.shared.registerForRemoteNotifications()
            }
          }
    }

    func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any]) async -> UIBackgroundFetchResult {
        print(userInfo)
        return .noData
    }

    func application(
      _ application: UIApplication,
      didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
    ) {
        let token = deviceToken.hexString
        Task {
            let update = MyTfcBb_V1_UpdatePushTokenRequest.with {
                $0.token = token
                #if DEBUG
                $0.env = .staging
                #else
                $0.env = .production
                #endif
                $0.platform = .ios
            }
            let _ = try? await TfcApi.shared.client.updatePushToken(update)
        }
    }


}

extension AppDelegate: UNUserNotificationCenterDelegate {
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        completionHandler([.badge, .sound, .banner])
    }
}

extension Data {
    var hexString: String {
        let hexString = map { String(format: "%02.2hhx", $0) }.joined()
        return hexString
    }
}
