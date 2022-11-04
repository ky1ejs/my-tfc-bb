//
//  LogInViewController.swift
//  My TFC BB
//
//  Created by Kyle Satti on 10/31/22.
//

import UIKit

class LogInViewController: UIViewController {
    private var loginView: LogInView { view as! LogInView }
    private let client = HTTPClient.unauthorizedClient

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
        let result = LogInCredentials(
            username: loginView.username,
            password: loginView.password,
            deviceId: UIDevice.current.identifierForVendor!.uuidString
        )

        Task {
            switch await client.call(endpoint: LogInEndpoint(input: result)) {
            case .success(let result):
                KeychainManager.setBackendAssignedId(result.deviceId)
                let windowScene = UIApplication.shared.connectedScenes.first as! UIWindowScene
                let delegate = windowScene.delegate as! SceneDelegate
                delegate.authenticated()
            case .failure(let error):
                let alert = UIAlertController(title: "Error", message: error.localizedDescription, preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "Damn man...", style: .cancel))
                self.present(alert, animated: true)
            }
        }
    }
}

