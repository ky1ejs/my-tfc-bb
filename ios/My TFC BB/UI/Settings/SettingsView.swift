//
//  SettingsView.swift
//  My TFC BB
//
//  Created by Kyle Satti on 10/22/23.
//

import SwiftUI

//struct SendTestPushRow: View {
//    var body: some View {
//
//    }
//}

struct TestPushError: LocalizedError {
    let error: Error
    var id: String { localizedDescription }

    var errorDescription: String? {
        "Error occured"
    }

    var body: String {
        error.localizedDescription
    }
}

struct SettingsView: View {
    @State private var lastError: TestPushError?
    @State private var alertPresented = false
    @State private var isTestPushLoading = false

    var body: some View {
        List {
            HStack {
                Button(action: sendTestPush) {
                    Text("Send test push notification")
                }.disabled(isTestPushLoading)
                Spacer()
                if isTestPushLoading {
                    ProgressView()
                }
            }
            NavigationLink("Devices") {
                DevicesView()
            }
        }
        .selectionDisabled(false)
        .navigationTitle("Settings")
        .toolbar {
            ToolbarItem {
                Button(action: logOut, label: {
                    Text("Log out")
                })
            }
        }
    }

    private func sendTestPush() {
        Task {
            isTestPushLoading = true
            do {
                let _ = try await TfcApi.client.sendTestPushNotication(Empty())
            } catch let error {
                lastError = TestPushError(error: error)
                alertPresented = true
            }
            isTestPushLoading = false
        }
    }

    private func logOut() {
        Task {
            let _ = try! await TfcApi.client.logOut(Empty())
            KeychainManager.clearKeyain()
            await SceneDelegate.shared.logedOut()
        }
    }
}

#Preview {
    SettingsView()
}
