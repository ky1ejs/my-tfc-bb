//
//  DeliveryCellContent.swift
//  My TFC BB
//
//  Created by Kyle Satti on 10/22/23.
//

import SwiftUI

struct DeliveryCellContent: View {
    private let delivery: Delivery
    private static let dateFormatter = RelativeDateTimeFormatter()
    @Environment(\.colorScheme) var colorScheme

    init(delivery: Delivery) {
        self.delivery = delivery
    }

    var body: some View {
        HStack(spacing: 18) {
            if (delivery.identifiedCourier  != .unidentified) {
                Image(uiImage: image(for: delivery.identifiedCourier))
                    .resizable()
                    .renderingMode(.template)
                    .foregroundColor(colorScheme == .dark ? .white : .black)
                    .scaledToFit()
                    .frame(width: 40, height: 40)


            } else {
                Image(uiImage: image(for: delivery.identifiedCourier))
                    .resizable()
                    .scaledToFit()
                    .frame(width: 40, height: 40)
            }
            VStack(alignment: .leading) {
                Text(delivery.name)
                    .font(.title3)
                Text(fuzzyDateFormatter(delivery.dateReceived.date)).foregroundStyle(.gray)
            }
        }
    }

    private func image(for courier: Courier) -> UIImage {
        let image: UIImage? = {
            switch courier {
            case .amazon: return UIImage(named: "Amazon")!
            case .fedex: return UIImage(named: "FedEx")!
            case .ups: return UIImage(named: "UPS")!
            case .usps: return UIImage(named: "USPS")!
            default: return nil
            }
        }()

        if var identifiedImage = image  {

            return identifiedImage
        }
        return UIImage(named: "Package")!
    }
}

func fuzzyDateFormatter(_ date: Date) -> String {
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

#Preview {
    var delivery = Delivery()
    delivery.identifiedCourier = .unidentified
    delivery.name = "New Amazon Delivery"
    delivery.dateReceived = .init(date: .now)
    return DeliveryCellContent(delivery: delivery)
        .border(.green)
}
