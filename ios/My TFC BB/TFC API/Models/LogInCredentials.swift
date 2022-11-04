//
//  LogInCredentials.swift
//  My TFC BB
//
//  Created by Kyle Satti on 11/3/22.
//

import Foundation

struct LogInCredentials: JsonResponseDecodable, Encodable {
    let username: String
    let password: String
    let deviceId: String
}
