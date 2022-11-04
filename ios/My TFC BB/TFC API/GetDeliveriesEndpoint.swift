//
//  GetDeliveriesEndpoint.swift
//  My TFC BB
//
//  Created by Kyle Satti on 11/3/22.
//

import Foundation

struct GetDeliveriesEndpoint: Endpoint {
    typealias SuccessType = Deliveries
    let url = URL(string: "\(TFC_API_BASE)/deliveries")!
    var method: HTTPMethod { .get }
}
