//
//  DeliveryCell.swift
//  My TFC BB
//
//  Created by Kyle Satti on 12/23/22.
//

import UIKit

class DeliveryCell: UITableViewCell {
    private static let df = RelativeDateTimeFormatter()
    private let titleLabel: UILabel = {
        let l = UILabel()
        l.font = UIFont.systemFont(ofSize: 16, weight: .bold)
        return l
    }()
    private let commentLabel: UILabel = {
        let l = UILabel()
        l.font = UIFont.systemFont(ofSize: 12)
        l.textColor = .gray
        return l
    }()
    private let dateLabel: UILabel = {
        let l = UILabel()
        l.font = UIFont.systemFont(ofSize: 12)
        l.textColor = .gray
        return l
    }()
    private let courierIcon: UIImageView = {
        let iv = UIImageView()
        iv.contentMode = .scaleAspectFit
        return iv
    }()

    var delivery: Delivery? {
        didSet {
            guard let delivery = delivery else { return }

            titleLabel.text = delivery.name
            commentLabel.text = delivery.comment
            dateLabel.text = type(of: self).df.string(for: Date(timeIntervalSince1970: delivery.dateReceived.timeIntervalSince1970))
            courierIcon.image = image(for: delivery.identifiedCourier)
        }
    }

    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)

        selectionStyle = .none

        let lableContainer = UIView()
        lableContainer.addSubview(titleLabel)
        lableContainer.addSubview(commentLabel)
        lableContainer.addSubview(dateLabel)
        contentView.addSubview(lableContainer)
        contentView.addSubview(courierIcon)
        contentView.disableAutolayoutConstraints()

        let horizontalPadding: CGFloat = 22
        let horizontalSpacing: CGFloat = 16
        let verticalPadding: CGFloat = 8
        let verticalSpacing: CGFloat = 4
        NSLayoutConstraint.activate([
            lableContainer.leadingAnchor.constraint(equalTo: courierIcon.trailingAnchor, constant: horizontalSpacing),
            lableContainer.topAnchor.constraint(equalTo: contentView.topAnchor, constant: verticalPadding),
            lableContainer.centerYAnchor.constraint(equalTo: contentView.centerYAnchor),
            lableContainer.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -horizontalPadding),
            lableContainer.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -verticalPadding),

            courierIcon.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: horizontalPadding),
            courierIcon.centerYAnchor.constraint(equalTo: contentView.centerYAnchor),
            courierIcon.widthAnchor.constraint(equalToConstant: 50),
            courierIcon.heightAnchor.constraint(equalToConstant: 80),

            titleLabel.leadingAnchor.constraint(equalTo: lableContainer.leadingAnchor),
            titleLabel.topAnchor.constraint(equalTo: lableContainer.topAnchor),
            titleLabel.trailingAnchor.constraint(equalTo: lableContainer.trailingAnchor),

            commentLabel.leadingAnchor.constraint(equalTo: lableContainer.leadingAnchor),
            commentLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: verticalSpacing),
            commentLabel.trailingAnchor.constraint(equalTo: lableContainer.trailingAnchor),

            dateLabel.leadingAnchor.constraint(equalTo: lableContainer.leadingAnchor),
            dateLabel.topAnchor.constraint(equalTo: commentLabel.bottomAnchor, constant: verticalSpacing),
            dateLabel.trailingAnchor.constraint(equalTo: lableContainer.trailingAnchor),
        ])
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
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
