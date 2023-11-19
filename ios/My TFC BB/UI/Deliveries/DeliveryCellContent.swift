//
//  DeliveryCellContent.swift
//  My TFC BB
//
//  Created by Kyle Satti on 10/22/23.
//

import SwiftUI
import tfc_bb_core

struct DeliveryCellContent: View {
    private let delivery: Delivery
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
                Text(RelativeDateFormatter.shared.format(delivery.dateReceived.date)).foregroundStyle(.gray)
            }
        }
    }

    private func image(for courier: Courier) -> UIImage {
        switch courier {
        case .amazon: return UIImage(named: "Amazon")!
        case .fedex: return UIImage(named: "FedEx")!
        case .ups: return UIImage(named: "UPS")!
        case .usps: return UIImage(named: "USPS")!
        default: return UIImage(named: "Package")!
        }
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
