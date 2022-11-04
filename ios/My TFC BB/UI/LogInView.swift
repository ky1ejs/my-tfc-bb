//
//  LogInView.swift
//  My TFC BB
//
//  Created by Kyle Satti on 10/31/22.
//

import UIKit



class LogInView: UIView {
    private let usernameTF: UITextField = {
        let tf = UITextField()
        tf.textContentType = .username
        tf.keyboardType = .emailAddress
        tf.autocorrectionType = .no
        tf.autocapitalizationType = .none
        tf.isSecureTextEntry = true
        tf.placeholder = "username"
        tf.returnKeyType = .next
        return tf
    }()
    private let passwordTF: UITextField = {
        let tf = UITextField()
        tf.textContentType = .password
        tf.placeholder = "password"
        tf.returnKeyType = .go
        return tf
    }()
    private let submitButton = UIButton(type: .system)

    var username: String { return usernameTF.text ?? "" }
    var password: String { return passwordTF.text ?? "" }
    func setSubmitAction(_ action: @escaping () -> ()) {
        submitButton.addAction(
            UIAction { _ in action() },
            for: .touchUpInside
        )
    }

    init() {
        super.init(frame: .zero)
        backgroundColor = #colorLiteral(red: 1, green: 0.8509630561, blue: 0.5459031463, alpha: 1)

        let titleLabel = UILabel()
        let subtitleLabel = UILabel()
        addSubview(titleLabel)
        addSubview(subtitleLabel)

        let container = UIView()
        container.addSubview(usernameTF)
        container.addSubview(passwordTF)
        container.addSubview(submitButton)
        addSubview(container)

        styleTextField(usernameTF)
        styleTextField(passwordTF)
        styleTitle(titleLabel)
        styleSubtitle(subtitleLabel)
        styleSubmitButton(submitButton)
        layout(titleLabel, subtitleLabel, container)
    }

    private func styleTitle(_ label: UILabel) {
        label.font = UIFont.systemFont(ofSize: 32, weight: .bold)
        label.text = "My TFC, But Better"
        label.textColor = .white
        label.textAlignment = .center
    }

    private func styleSubtitle(_ label: UILabel) {
        label.font = UIFont.systemFont(ofSize: 18, weight: .bold)
        label.textColor = .white
        label.text = "Quickly see your packages and get notifications as they're delivered and collected."
        label.numberOfLines = 0
        label.textAlignment = .center
    }

    private func styleTextField(_ tf: UITextField) {
        tf.layer.cornerRadius = 5
        tf.heightAnchor.constraint(equalToConstant: 50).isActive = true
        tf.backgroundColor = .white
        tf.leftView = UIView(frame: CGRectMake(0, 0, 15, 50))
        tf.leftViewMode = .always
    }

    private func styleSubmitButton(_ submitButton: UIButton) {
        submitButton.setTitle("log in", for: .normal)
        submitButton.titleLabel?.font = UIFont.systemFont(ofSize: 16, weight: .bold)
        submitButton.setTitleColor(.white, for: .normal)
        submitButton.backgroundColor = #colorLiteral(red: 0.995413363, green: 0.7451600432, blue: 0.2731953263, alpha: 1)
        submitButton.heightAnchor.constraint(equalToConstant: 44).isActive = true
        submitButton.widthAnchor.constraint(equalToConstant: 120).isActive = true
        submitButton.layer.cornerRadius = 8
    }

    private func layout(_ titleLabel: UILabel, _ subtitleLabel: UILabel, _ container: UIView) {
        disableAutolayoutConstraints()

        NSLayoutConstraint.activate([
            titleLabel.topAnchor.constraint(equalTo: safeAreaLayoutGuide.topAnchor, constant: 18),
            titleLabel.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 20),
            titleLabel.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -20),

            subtitleLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 12),
            subtitleLabel.leadingAnchor.constraint(equalTo: titleLabel.leadingAnchor),
            subtitleLabel.trailingAnchor.constraint(equalTo: titleLabel.trailingAnchor),

            container.topAnchor.constraint(equalTo: subtitleLabel.bottomAnchor, constant: 30),
            container.centerXAnchor.constraint(equalTo: centerXAnchor),
            container.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 20),

            usernameTF.topAnchor.constraint(equalTo: container.safeAreaLayoutGuide.topAnchor),
            usernameTF.leadingAnchor.constraint(equalTo: container.leadingAnchor),
            usernameTF.trailingAnchor.constraint(equalTo: container.trailingAnchor),

            passwordTF.topAnchor.constraint(equalTo: usernameTF.bottomAnchor, constant: 20),
            passwordTF.leadingAnchor.constraint(equalTo: container.leadingAnchor),
            passwordTF.trailingAnchor.constraint(equalTo: container.trailingAnchor),

            submitButton.centerXAnchor.constraint(equalTo: container.centerXAnchor),
            submitButton.topAnchor.constraint(equalTo: passwordTF.bottomAnchor, constant: 20),
            submitButton.bottomAnchor.constraint(equalTo: container.bottomAnchor),
        ])
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
