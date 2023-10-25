//
//  KeychainManager.swift
//  My TFC BB
//
//  Created by Kyle Satti on 11/3/22.
//

import Foundation
import KeychainAccess

public struct KeychainManager {
    private static let BACKEND_DEVICE_ID_KEY = "backend_assigned_device_id"
    private static let keychain = Keychain(service: "dev.kylejs.My-TFC-BB", accessGroup: "X2TBSUCASC.dev.kylejs.My-TFC-BB.shared")

    public static func getBackendAssignedId() -> String? {
        return try? keychain.getString(BACKEND_DEVICE_ID_KEY)
    }

    public static func setBackendAssignedId(_ id: String) {
        try? keychain.set(id, key: BACKEND_DEVICE_ID_KEY)
    }

    public static func clearKeyain() {
        try? keychain.removeAll()
    }
}
