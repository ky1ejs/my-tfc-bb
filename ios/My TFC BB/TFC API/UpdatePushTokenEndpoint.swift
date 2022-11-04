//
//  UpdatePushTokenEndpoint.swift
//  My TFC BB
//
//  Created by Kyle Satti on 11/3/22.
//

import Foundation

struct UpdatePushTokenEndpoint: Endpoint {
    let tokenUpdate: TokenUpdate
    typealias SuccessType = EmptyResponse
    let url = URL(string: "\(TFC_API_BASE)/deliveries")!
    var method: HTTPMethod { .post(body: tokenUpdate) }
}

