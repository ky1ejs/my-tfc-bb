//
//  HTTPClient+Helper.swift
//  My TFC BB
//
//  Created by Kyle Satti on 11/3/22.
//

import Foundation

extension HTTPClient {
    static var authorizedClient: HTTPClient {
        HTTPClient(headers: [
            "Content-Type": "application/json",
            "device_id": KeychainManager.getBackendAssignedId()!
        ])
    }
    
    static var unauthorizedClient: HTTPClient {
        HTTPClient(headers: ["Content-Type": "application/json"])
    }
}
