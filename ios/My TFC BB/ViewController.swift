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

        loginView.setSubmitAction { [weak self] in
            self?.logIn()
        }
    }

    private func logIn() {
        let result = LogInResult(
            username: loginView.username,
            password: loginView.password,
            deviceId: UIDevice.current.identifierForVendor!.uuidString
        )

        Task {
            let result = await HTTPClient(headers: ["Content-Type": "application/json"]).call(endpoint: LogInEndpoint(input: result))
            print(result)
        }
    }
}

