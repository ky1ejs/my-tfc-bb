//
//  LogInView.swift
//  My TFC BB
//
//  Created by Kyle Satti on 10/31/22.
//

import UIKit

class LogInView: UIView {
    let usernameTF = UITextField()
    let passwordTF = UITextField()
    let submitButton = UIButton(type: .system)

    init() {
        super.init(frame: .zero)

        usernameTF.backgroundColor = .white
        passwordTF.backgroundColor = .white
        
        let container = UIView()
        container.translatesAutoresizingMaskIntoConstraints = false
        container.backgroundColor = .lightGray

        container.addSubview(usernameTF)
        container.addSubview(passwordTF)
        container.addSubview(submitButton)

        container.subviews.forEach { $0.translatesAutoresizingMaskIntoConstraints = false }

        submitButton.setTitle("Log In", for: .normal)

        addSubview(container)

        NSLayoutConstraint.activate([
            usernameTF.topAnchor.constraint(equalTo: container.safeAreaLayoutGuide.topAnchor),
            usernameTF.leadingAnchor.constraint(equalTo: container.leadingAnchor),
            usernameTF.trailingAnchor.constraint(equalTo: container.trailingAnchor),

            passwordTF.topAnchor.constraint(equalTo: usernameTF.bottomAnchor, constant: 20),
            passwordTF.leadingAnchor.constraint(equalTo: container.leadingAnchor),
            passwordTF.trailingAnchor.constraint(equalTo: container.trailingAnchor),

            submitButton.centerXAnchor.constraint(equalTo: container.centerXAnchor),
            submitButton.topAnchor.constraint(equalTo: passwordTF.bottomAnchor, constant: 20),
            submitButton.bottomAnchor.constraint(equalTo: container.bottomAnchor),

            container.topAnchor.constraint(equalTo: topAnchor, constant: 80),
            container.centerXAnchor.constraint(equalTo: centerXAnchor),
            container.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 20)
        ])
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
