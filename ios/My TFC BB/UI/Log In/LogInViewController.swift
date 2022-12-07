//
//  LogInViewController.swift
//  My TFC BB
//
//  Created by Kyle Satti on 10/31/22.
//

import UIKit

class LogInViewController: UIViewController {
    private var loginView: LogInView { view as! LogInView }
    private let client = TfcApi.client

    override func loadView() {
        view = LogInView()
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.

        loginView.setSubmitAction { [weak self] in
            self?.logIn()
        }
    }

    private func logIn() {
        let request = MyTfcBb_V1_LogInRequest.with {
            $0.username = loginView.username
            $0.password = loginView.password
            $0.deviceID = UIDevice.current.identifierForVendor!.uuidString
        }

        Task {
            do {
                let response = try await client.logIn(request)
                KeychainManager.setBackendAssignedId(response.deviceID)
                SceneDelegate.shared.authenticated()
            } catch let error {
                let alert = UIAlertController(title: "Error", message: error.localizedDescription, preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "Damn man...", style: .cancel))
                self.present(alert, animated: true)
            }
        }
    }
}

