//
//  LogInViewController.swift
//  My TFC BB
//
//  Created by Kyle Satti on 10/31/22.
//

import UIKit
import GRPC

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
            let currentDevice = UIDevice.current

            $0.username = loginView.username
            $0.password = loginView.password
            $0.deviceID = currentDevice.identifierForVendor!.uuidString
            $0.deviceName = currentDevice.name
        }

        loginView.state = .loading
        Task {
            do {
                let response = try await client.logIn(request)
                KeychainManager.setBackendAssignedId(response.deviceID)
                SceneDelegate.shared.authenticated()
            } catch let error {
                let alert = UIAlertController(title: nil, message: nil, preferredStyle: .alert)

                if let status = error as? GRPCStatus, status.code == .unauthenticated {
                    alert.title = "Invalid credentials"
                    alert.message = "That username/password combination is incorrect"
                } else {
                    alert.title = "Error"
                    alert.message = error.localizedDescription
                }

                alert.addAction(UIAlertAction(title: "Damn man...", style: .cancel))
                self.present(alert, animated: true)
            }
            loginView.state = .normal
        }
    }
}

