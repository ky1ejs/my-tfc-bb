//
//  LogInEndpoint.swift
//  My TFC BB
//
//  Created by Kyle Satti on 10/31/22.
//

import Foundation

struct LogInEndpoint: Endpoint {
    let input: LogInCredentials

    typealias SuccessType = BackendAssignedId
    let url = URL(string: "\(TFC_API_BASE)/login")!
    var method: HTTPMethod { .post(body: input) }
}
