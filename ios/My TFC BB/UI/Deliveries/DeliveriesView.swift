//
//  DeliveriesView.swift
//  My TFC BB
//
//  Created by Kyle Satti on 10/22/23.
//

import SwiftUI

protocol DeliveriesProvider {
    func provideDeliveries() async throws -> [Delivery]
}

struct DeliveriesView: View {
    enum ViewState {
        case loading
        case error
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
                case .error: Text("There was an error")
                case .loaded(let deliveries):
                    if deliveries.isEmpty {
                        Text("No deliveries")
                    } else {
                        List(deliveries) { delivery in
                            DeliveryCellContent(delivery: delivery)
                        }
                        .refreshable {
                            await refreshData()
                        }
                        .listStyle(.plain)
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
        }
    }

    func refreshData() async {
        do {
            let deliveries = try await provider.provideDeliveries()
            withAnimation {
                state = .loaded(deliveries)
            }
        } catch {
            state = .error
        }
    }
}

extension Delivery: Identifiable {
    typealias ID = String
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

#Preview {
    DeliveriesView(provider: FakeProvider())
}