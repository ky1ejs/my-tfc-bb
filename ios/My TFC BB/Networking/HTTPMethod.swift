//
//  HTTPMethod.swift
//  Droto
//
//  Created by Kyle Satti on 04/06/2022.
//

import Foundation

enum HTTPMethod {
    case get
    case post(body: Encodable?)
    case delete
    case patch

    var value: String {
        switch self {
        case .get: return "GET"
        case .post: return "POST"
        case .delete: return "DELETE"
        case .patch: return "PATCH"
        }
    }
}
