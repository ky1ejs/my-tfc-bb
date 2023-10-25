//
//  LogInView.swift
//  My TFC BB
//
//  Created by Kyle Satti on 10/22/23.
//

import SwiftUI
import GRPC
import tfc_bb_core

struct LogInView: View {
    @State private var username = ""
    @State private var password = ""
    @State private var lastError: LogInError?
    @State private var alertPresented = false
    @State private var isLoading = false

    var body: some View {
        ZStack {
            Color(uiColor: .lightOrange)
                .ignoresSafeArea()
            VStack {
                Text("My TFC, but better")
                    .font(.title)
                    .fontWeight(.bold)
                    .padding(.bottom, 4)
                    .foregroundColor(.black)
                Text("Quickly see your packages and get notifications as they're delivered and collected.")
                    .multilineTextAlignment(.center)
                    .font(.title3)
                    .foregroundColor(.black)
                    .padding(.bottom, 32)
                VStack(spacing: 16) {
                    TextField(text: $username) {
                        Text("username")
                    }
                    .textFieldStyle(TfStyle())
                    .keyboardType(.emailAddress)
                    .autocorrectionDisabled()
                    .textInputAutocapitalization(.never)
                    .disabled(isLoading)

                    SecureField(text: $password) {
                        Text("password")
                    }
                    .textFieldStyle(TfStyle())
                    .disabled(isLoading)
                }
                Button(action: logIn, label: {
                    if isLoading {
                        ProgressView()
                    } else {
                        Text("log in")
                    }
                })
                .disabled(isLoading)
                .padding(.horizontal, 24)
                .padding(.vertical, 10)
                .foregroundColor(.white)
                .background(Color(uiColor: .darkOrange))
                .clipShape(RoundedRectangle(cornerRadius: 5))
                .padding(.top, 24)
                Spacer()
            }
            .padding(.horizontal, 18)
            .padding(.top, 36)
            .alert(isPresented: $alertPresented, error: lastError) { _ in
                Button("try again") {}
            } message: { error in
                Text(error.body)
            }

        }
    }

    private func logIn() {
        guard isLoading == false else { return }

        isLoading = true

        let request = MyTfcBb_V1_LogInRequest.with {
            let currentDevice = UIDevice.current

            $0.username = username
            $0.password = password
            $0.deviceID = currentDevice.identifierForVendor!.uuidString
            $0.deviceName = currentDevice.name
        }

        Task {
            do {
                let response = try await TfcApi.shared.client.logIn(request)
                KeychainManager.setBackendAssignedId(response.deviceID)
                await SceneDelegate.shared?.authenticated()
            } catch let error {
                if let status = error as? GRPCStatus, status.code == .unauthenticated {
                    lastError = .invalidCredentials
                } else {
                    lastError = .unknownError(error)
                }
                alertPresented = true
            }
            isLoading = false
        }
    }

    private func createTextField(field: Binding<String>, placeholder: String) -> some View {
        TextField(text: field) {
            Text(placeholder)
        }

    }
}

struct TfStyle: TextFieldStyle {
    func _body(configuration: TextField<Self._Label>) -> some View {
            configuration
            .padding(.vertical, 10)
            .padding(.horizontal, 6)
            .background(.white)
            .clipShape(RoundedRectangle(cornerRadius: 5))
            .foregroundColor(.black)
        }
}

enum LogInError: LocalizedError, Identifiable {
    case invalidCredentials
    case unknownError(Error)

    var id: String { localizedDescription }

    var errorDescription: String? {
        switch self {
        case .invalidCredentials: return "Invalid credentials"
        case .unknownError: return "Unknown Error"
        }
    }

    var body: String {
        switch self {
        case .invalidCredentials: return "That username/password combination is incorrect"
        case .unknownError(let error): return error.localizedDescription
        }
    }
}

private extension TextField {
    func styledTextField() -> some View  {
        padding(.horizontal, 6)

    }
}

#Preview {
    LogInView()
}
