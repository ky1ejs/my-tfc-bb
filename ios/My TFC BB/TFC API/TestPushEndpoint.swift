//
//  TestPushEndpoint.swift
//  My TFC BB
//
//  Created by Kyle Satti on 11/8/22.
//

import Foundation

struct TestPushEndpoint: Endpoint {
    typealias SuccessType = EmptyResponse
    let url = URL(string: "\(TFC_API_BASE)/push/test")!
    var method: HTTPMethod { .get }
}
