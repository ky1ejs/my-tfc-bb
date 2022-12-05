//
//  SettingsViewController.swift
//  My TFC BB
//
//  Created by Kyle Satti on 11/8/22.
//

import UIKit

class SettingsViewController: UITableViewController {
    init() {
        super.init(style: .grouped)
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        navigationItem.rightBarButtonItem = UIBarButtonItem(primaryAction: UIAction(title: "Log Out", handler: { [unowned self] _ in
            self.logOut()
        }))
    }

    override func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 1
    }

    override func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        return "Notifications"
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = UITableViewCell(style: .default, reuseIdentifier: "cell")
        cell.textLabel?.text = "Send test push notification"
        cell.selectionStyle = .none
        return cell
    }

    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        sendTestPush()
    }

    private func sendTestPush() {
        Task {
            do {
                let _ = try await TfcApi.client.sendTestPushNotication(Empty())
            } catch let error {
                let alert = UIAlertController(title: "Error", message: error.localizedDescription, preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "Damn man...", style: .cancel))
                self.present(alert, animated: true)
            }
        }
    }

    private func logOut() {
        Task {
            do {
                let _ = try await TfcApi.client.logOut(Empty())
                KeychainManager.clearKeyain()
                SceneDelegate.shared.logedOut()
            } catch let error {
                let alert = UIAlertController(title: "Error", message: error.localizedDescription, preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "Damn man...", style: .cancel))
                self.present(alert, animated: true)
            }
        }
    }
}

//class NotificationCell: UITableViewCell {
//    init(identifier: String) {
//        super.init(style: .default, reuseIdentifier: identifier)
//
//        UNUserNotificationCenter.current().getNotificationSettings { settings in
//            guard settings.authorizationStatus == .authorized else { return }
//            DispatchQueue.main.async {
//                UIApplication.shared.registerForRemoteNotifications()
//            }
//        }
//    }
//}
