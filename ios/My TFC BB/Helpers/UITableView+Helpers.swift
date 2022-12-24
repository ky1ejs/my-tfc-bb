//
//  UITableView+Helpers.swift
//  My TFC BB
//
//  Created by Kyle Satti on 12/23/22.
//

import UIKit

extension UITableView {
    private func identifier(for klass: UITableViewCell.Type) -> String {
        return String(describing: klass)
    }

    func register(_ klass: UITableViewCell.Type) {
        register(klass, forCellReuseIdentifier: identifier(for: klass))
    }

    func dequeue<T: UITableViewCell>(cellOf klass: T.Type) -> T {
        return dequeueReusableCell(withIdentifier: identifier(for: klass)) as! T
    }
}
