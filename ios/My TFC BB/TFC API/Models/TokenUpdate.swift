//
//  TokenUpdate.swift
//  My TFC BB
//
//  Created by Kyle Satti on 11/3/22.
//

import Foundation

struct TokenUpdate: Encodable {
    let pushToken: String
    let tokenEnv: TokenEnv
    let platform = "IOS"
}

enum TokenEnv: String, Encodable {
    case staging = "STAGING"
    case production = "PRODUCTION"
}
