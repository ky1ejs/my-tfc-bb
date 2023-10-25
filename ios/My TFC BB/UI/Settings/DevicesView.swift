//
//  DevicesView.swift
//  My TFC BB
//
//  Created by Kyle Satti on 10/22/23.
//

import SwiftUI
import tfc_bb_core

protocol DevicesLoader {
    func loadDevices() async throws -> [Device]
}

struct DeviceFetcher: DevicesLoader {
    func loadDevices() async throws -> [Device] {
        let response = try await TfcApi.shared.client.getDevices(Empty())
        return response.devices
    }
}

struct DevicesView: View {
    enum ViewState {
        case loading
        case loaded([Device])
        case error(Error)
    }
    @State private var state = ViewState.loading
    private let loader: DevicesLoader

    init(loader: DevicesLoader = DeviceFetcher()) {
        self.loader = loader
    }

    var body: some View {
        HStack {
            switch state {
            case .loading: ProgressView()
            case .error(let error):
                Text("There was an error")
                    .font(.title3)
                Text(error.localizedDescription.description)
                Spacer(minLength: 12)
                Button("Try again") {
                    state = .loading
                    Task {
                        await fetchData()
                    }
                }
            case .loaded(let devices):
                List(devices) { device in
                    Text(device.name)
                }
            }
        }.navigationTitle("Logged-in Devices")
        .task {
            do {
                state = .loaded(try await loader.loadDevices())
            } catch let error {
                state = .error(error)
            }
        }
    }

    private func fetchData() async {
        do {
            let response = try await TfcApi.shared.client.getDevices(Empty())
            state = .loaded(response.devices)
        } catch let error {
            state = .error(error)
        }
    }
}

extension Device: Identifiable {}

struct FakeDeviceLoader: DevicesLoader {
    func loadDevices() async throws -> [Device] {
        var device = Device()
        device.name = "Kyle's iPhone"
        device.id = "123"
        return [device]
    }
}

#Preview {
    DevicesView(loader: FakeDeviceLoader())
}
