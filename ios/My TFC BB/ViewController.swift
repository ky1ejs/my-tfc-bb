//
//  ViewController.swift
//  My TFC BB
//
//  Created by Kyle Satti on 10/31/22.
//

import UIKit

class ViewController: UIViewController {
    private var loginView: LogInView { view as! LogInView }

    override func loadView() {
        view = LogInView()
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.

        loginView.submitButton.addTarget(self, action: #selector(logIn), for: .touchUpInside)
    }

    @objc private func logIn() {
        let result = LogInResult(
            username: loginView.usernameTF.text!,
            password: loginView.passwordTF.text!,
            deviceId: UIDevice.current.identifierForVendor!.uuidString
        )

        Task {
            let result = await HTTPClient(headers: ["Content-Type": "application/json"]).call(endpoint: LogInEndpoint(input: result))
            print(result)
        }
    }
}

