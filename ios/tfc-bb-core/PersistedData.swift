//
//  PersistedData.swift
//  My TFC BB
//
//  Created by Kyle Satti on 12/21/23.
//

import Foundation

public struct PersistedData: Codable {
    public let lastUpdate: Date
    public let deliveriesCount: Int

    public init(lastUpdate: Date, deliveriesCount: Int) {
        self.lastUpdate = lastUpdate
        self.deliveriesCount = deliveriesCount
    }
}

public struct DataStorage {
    static private var path = FileManager.default
        .containerURL(forSecurityApplicationGroupIdentifier: APP_GROUP)!
        .appending(path: "data.json")

    public static func write(_ data: PersistedData) {
        let encoded = try! JSONEncoder().encode(data)
        try! encoded.write(to: path)
    }

    public static func readData() -> PersistedData? {
        guard FileManager.default.fileExists(atPath: path.path) else {
            return nil
        }
        let data = try! Data(contentsOf: path)
        return try! JSONDecoder().decode(PersistedData.self, from: data)
    }

    public static func clearData() {
        if FileManager.default.fileExists(atPath: path.path) {
            try! FileManager.default.removeItem(atPath: path.path)
        }
    }
}

