//
//  UIView+Helpers.swift
//  My TFC BB
//
//  Created by Kyle Satti on 11/3/22.
//

import UIKit

extension UIView {
    func disableAutolayoutConstraints() {
        subviews.forEach(disableAutolayoutConstraints(_:))
    }

    private func disableAutolayoutConstraints(_ view: UIView) {
        view.translatesAutoresizingMaskIntoConstraints = false
        view.subviews.forEach(disableAutolayoutConstraints(_:))
    }
}
