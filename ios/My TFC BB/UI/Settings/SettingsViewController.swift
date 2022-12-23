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
        return 2
    }

    override func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        return "Notifications"
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = UITableViewCell(style: .default, reuseIdentifier: "cell")
        switch indexPath.row {
        case 0:
            cell.textLabel?.text = "Send test push notification"
            cell.selectionStyle = .none
        case 1:
            cell.textLabel?.text = "Devices"
            cell.selectionStyle = .none
        default:
            assertionFailure("Invalid index path")
        }

        return cell
    }

    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        switch indexPath.row {
        case 0:
            sendTestPush()
        case 1:
            self.navigationController?.pushViewController(DevicesViewController(), animated: true)
        default:
            assertionFailure("Invalid index path")
        }

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

