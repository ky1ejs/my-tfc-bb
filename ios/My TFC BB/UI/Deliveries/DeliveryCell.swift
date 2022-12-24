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
    private let bookerLabel: UILabel = {
        let l = UILabel()
        l.font = UIFont.systemFont(ofSize: 12)
        l.textColor = .gray
        return l
    }()

    var delivery: Delivery? {
        didSet {
            guard let delivery = delivery else { return }

            titleLabel.text = delivery.name
            commentLabel.text = delivery.comment
            dateLabel.text = type(of: self).df.string(for: Date(timeIntervalSince1970: delivery.dateReceived.timeIntervalSince1970))
            bookerLabel.text = "✍️ \(delivery.bookedInByFirstName) \(delivery.bookedInByLastName)"
        }
    }

    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)

        selectionStyle = .none

        let lableContainer = UIView()
        lableContainer.addSubview(titleLabel)
        lableContainer.addSubview(commentLabel)
        lableContainer.addSubview(dateLabel)
        lableContainer.addSubview(bookerLabel)
        contentView.addSubview(lableContainer)
        contentView.disableAutolayoutConstraints()

        let horizontalPadding: CGFloat = 22
        let verticalPadding: CGFloat = 8
        let verticalSpacing: CGFloat = 4
        NSLayoutConstraint.activate([
            lableContainer.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: horizontalPadding),
            lableContainer.topAnchor.constraint(equalTo: contentView.topAnchor, constant: verticalPadding),
            lableContainer.centerYAnchor.constraint(equalTo: contentView.centerYAnchor),
            lableContainer.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -horizontalPadding),
            lableContainer.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -verticalPadding),

            titleLabel.leadingAnchor.constraint(equalTo: lableContainer.leadingAnchor),
            titleLabel.topAnchor.constraint(equalTo: lableContainer.topAnchor),
            titleLabel.trailingAnchor.constraint(equalTo: lableContainer.trailingAnchor),

            commentLabel.leadingAnchor.constraint(equalTo: lableContainer.leadingAnchor),
            commentLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: verticalSpacing),
            commentLabel.trailingAnchor.constraint(equalTo: lableContainer.trailingAnchor),

            dateLabel.leadingAnchor.constraint(equalTo: lableContainer.leadingAnchor),
            dateLabel.topAnchor.constraint(equalTo: commentLabel.bottomAnchor, constant: verticalSpacing),
            dateLabel.trailingAnchor.constraint(equalTo: lableContainer.trailingAnchor),

            bookerLabel.leadingAnchor.constraint(equalTo: lableContainer.leadingAnchor),
            bookerLabel.topAnchor.constraint(equalTo: dateLabel.bottomAnchor, constant: verticalSpacing),
            bookerLabel.trailingAnchor.constraint(equalTo: lableContainer.trailingAnchor),
            bookerLabel.bottomAnchor.constraint(equalTo: lableContainer.bottomAnchor)
        ])
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
