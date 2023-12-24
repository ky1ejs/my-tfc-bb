//
//  DeliveriesView.swift
//  My TFC BB
//
//  Created by Kyle Satti on 10/22/23.
//

import SwiftUI
import tfc_bb_core
import WidgetKit

protocol DeliveriesProvider {
    func provideDeliveries() async throws -> [Delivery]
}

struct DeliveriesView: View {
    enum ViewState {
        case loading
        case error(Error)
        case loaded([Delivery])
    }
    private let provider: DeliveriesProvider
    @State private var state: ViewState = .loading

    init(provider: DeliveriesProvider) {
        self.provider = provider
    }

    var body: some View {
        NavigationStack{
            HStack {
                switch state {
                case .loading:
                    ProgressView("...loading")
                        .tint(Color(uiColor: .lightOrange))
                        .task {
                            await refreshData()
                        }
                case .error(let error):
                    messageView(
                        "whoops, there's been an error",
                        error.localizedDescription
                    )
                case .loaded(let deliveries):
                        if (deliveries.count > 0) {
                            List(deliveries) { delivery in
                                DeliveryCellContent(delivery: delivery)
                            }.refreshable {
                                await refreshData()
                            }
                            .listStyle(.plain)
                        }
                        if deliveries.isEmpty {
                            messageView(
                                "all deliveries collected",
                                nil
                            )
                        }
                }
            }
            .navigationTitle("Deliveries")
            .toolbar(content: {
                ToolbarItem {
                    NavigationLink {
                        SettingsView()
                    } label: {
                        Text("Settings")
                    }
                }
            })
            .navigationBarTitleDisplayMode(.automatic)
            .onAppear(perform: {
                UNUserNotificationCenter.current()
                    .requestAuthorization(options: [.alert, .sound, .badge]) { granted, _ in
                        guard granted else { return }
                        DispatchQueue.main.async {
                            UIApplication.shared.registerForRemoteNotifications()
                        }
                    }
            })
        }
    }

    func refreshData() async {
        do {
            let deliveries = try await provider.provideDeliveries()
            withAnimation {
                state = .loaded(deliveries)
            }
        } catch {
            state = .error(error)
        }
    }

    func messageView(_ title: String, _ body: String?) -> some View {
        VStack {
            Text(title)
                .font(.title)
                .foregroundStyle(Color(uiColor: .darkGray))
            if let body = body {
                Text(body)
                    .font(.footnote)
                    .foregroundStyle(Color(uiColor: .lightGray))
                    .padding(.bottom, 24)
            }
            Button {
                withAnimation {
                    state = .loading
                }
                Task {
                    await refreshData()
                }
            } label: {
                Text("refresh")
                    .padding(.horizontal, 14)
                    .padding(.vertical, 8)
                    .overlay(
                RoundedRectangle(cornerRadius: 8)
                        .stroke(Color(uiColor: .lightOrange), lineWidth: 2)
                )
            }
        }
    }
}

extension Delivery: Identifiable {
    public typealias ID = String
}

struct FakeProvider: DeliveriesProvider {
    func provideDeliveries() async throws -> [Delivery] {
        var delivery1 = Delivery()
        delivery1.identifiedCourier = .amazon
        delivery1.id = "1234"
        delivery1.name = "delivery from amazon"
        delivery1.dateReceived = .init(date: .now)
        var delivery2 = Delivery()
        delivery2.identifiedCourier = .ups
        delivery2.id = "12346"
        delivery2.name = "delivery from UPS"
        delivery2.dateReceived = .init(date: .now)
        return [delivery1, delivery2]
    }
}

struct EmptyFakeProvider: DeliveriesProvider {
    func provideDeliveries() async throws -> [Delivery] {
        try await Task.sleep(nanoseconds: 1_000_000_000)
        return []
    }
}

#Preview {
    DeliveriesView(provider: FakeProvider())
}

#Preview {
    DeliveriesView(provider: EmptyFakeProvider())
}
