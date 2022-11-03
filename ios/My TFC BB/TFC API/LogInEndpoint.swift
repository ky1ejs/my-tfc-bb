//
//  LogInEndpoint.swift
//  My TFC BB
//
//  Created by Kyle Satti on 10/31/22.
//

import Foundation

struct LogInResult: JsonResponseDecodable, Encodable {
    let username: String
    let password: String
    let deviceId: String
}

struct LogInEndpoint: Endpoint {
    let input: LogInResult

    typealias SuccessType = LogInResult
    let url = URL(string: "http://localhost:3000/my-tfc/v1/login")!
    var method: HTTPMethod { .post(body: input) }
}
