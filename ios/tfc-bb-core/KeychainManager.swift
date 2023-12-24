//
//  KeychainManager.swift
//  My TFC BB
//
//  Created by Kyle Satti on 11/3/22.
//

import Foundation
import KeychainAccess

public struct KeychainManager {
    private static let OLD_BACKEND_DEVICE_ID_KEY = "backend_assigned_device_id_shared"
    private static let BACKEND_DEVICE_ID_KEY = "backend_assigned_device_id_v0"
    private static let keychain = Keychain(
        service: "dev.kylejs.My-TFC-BB",
        accessGroup: "\(TEAM_ID).dev.kylejs.My-TFC-BB.shared"
    ).accessibility(.afterFirstUnlock)

public static func getBackendAssignedId() throws -> String? {
        if let oldStoredId = try keychain.getString(OLD_BACKEND_DEVICE_ID_KEY) {
            try setBackendAssignedId(oldStoredId)
            try keychain.remove(OLD_BACKEND_DEVICE_ID_KEY)
        }
        return try keychain.getString(BACKEND_DEVICE_ID_KEY)
    }

    public static func setBackendAssignedId(_ id: String) throws {
        try keychain.set(id, key: BACKEND_DEVICE_ID_KEY)
    }

    public static func clearKeyain() throws {
        try keychain.removeAll()
    }
}
