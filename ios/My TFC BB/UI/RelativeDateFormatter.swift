//
//  RelativeDateFormatter.swift
//  My TFC BB
//
//  Created by Kyle Satti on 11/19/23.
//

import Foundation

class RelativeDateFormatter {
    private static let dateFormatter = RelativeDateTimeFormatter()
    // var so that it loads lazily
    private(set) static var shared = RelativeDateFormatter()

    func format(_ date: Date) -> String {
        let calendar = Calendar.current
        let now = Date()

        // Calculate the time difference in seconds
        let components = calendar.dateComponents([.second], from: date, to: now)
        let seconds = components.second ?? 0

        if seconds < 0 {
            // Handle future dates
            return "in the future"
        } else if seconds < 5 {
            return "just now"
        } else if seconds < 60 {
            return "\(seconds) seconds ago"
        } else if seconds < 3600 {
            let minutes = seconds / 60
            return "\(minutes) minute\(minutes == 1 ? "" : "s") ago"
        } else if seconds < 86400 {
            let hours = seconds / 3600
            return "\(hours) hour\(hours == 1 ? "" : "s") ago"
        } else if calendar.isDateInYesterday(date) {
            return "yesterday"
        } else if seconds < 604800 {
            let days = seconds / 86400
            return "\(days) day\(days == 1 ? "" : "s") ago"
        } else {
            let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = "MMM d, yyyy"
            return dateFormatter.string(from: date)
        }
    }
}
