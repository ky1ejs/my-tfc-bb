//
//  KeychainManager.swift
//  My TFC BB
//
//  Created by Kyle Satti on 11/3/22.
//

import Foundation
import KeychainAccess

struct KeychainManager {
    private static let BACKEND_DEVICE_ID_KEY = "backend_assigned_device_id"

    static func getBackendAssignedId() -> String? {
        return try? Keychain().getString(BACKEND_DEVICE_ID_KEY)
    }

    static func setBackendAssignedId(_ id: String) {
        try? Keychain().set(id, key: BACKEND_DEVICE_ID_KEY)
    }

    static func clearKeyain() {
        try? Keychain().removeAll()
    }
}
