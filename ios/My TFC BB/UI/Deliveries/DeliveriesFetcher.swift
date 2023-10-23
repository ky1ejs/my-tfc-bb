//
//  DeliveriesFetcher.swift
//  My TFC BB
//
//  Created by Kyle Satti on 10/22/23.
//

import Foundation

struct DeliveriesFetcher {
}

extension DeliveriesFetcher: DeliveriesProvider {
    func provideDeliveries() async throws -> [Delivery] {
        let response = try await TfcApi.client.getDeliveries(MyTfcBb_V1_GetDeliveriesRequest())
        return response.deliveries
    }
}
