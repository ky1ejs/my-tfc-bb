//
//  DeliveriesViewController.swift
//  My TFC BB
//
//  Created by Kyle Satti on 11/3/22.
//

import UIKit

class DeliveresViewController: UITableViewController {
    private var deliveries = [Delivery]()

    init() {
        super.init(style: .plain)
        title = "Packages"
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.register(DeliveryCell.self)
        fetchData()

        let refreshControl = UIRefreshControl()
        refreshControl.addAction(UIAction(handler: { _ in
            self.fetchData()
        }), for: .valueChanged)
        tableView.refreshControl = refreshControl

        navigationItem.rightBarButtonItem = UIBarButtonItem(title: "Settings", primaryAction: UIAction(handler: { _ in
            self.navigationController?.pushViewController(SettingsViewController(), animated: true)
        }))
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        UNUserNotificationCenter.current()
            .requestAuthorization(options: [.alert, .sound, .badge]) { granted, _ in
                guard granted else { return }
                DispatchQueue.main.async {
                    UIApplication.shared.registerForRemoteNotifications()
                }
            }
    }

    override func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return deliveries.count
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeue(cellOf: DeliveryCell.self)
        cell.delivery = deliveries[indexPath.row]
        return cell
    }

    private func fetchData() {
        tableView.refreshControl?.beginRefreshing()
        Task {
            do {
                let response = try await TfcApi.client.getDeliveries(MyTfcBb_V1_GetDeliveriesRequest())
                self.deliveries = response.deliveries
                self.tableView.reloadData()
                let deliverCount = response.deliveries.count
                self.title = deliverCount > 0 ? "Packages (\(deliverCount))" : "Packages"
            } catch let error {
                let alert = UIAlertController(title: "Error", message: error.localizedDescription, preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "Damn man...", style: .cancel))
                self.present(alert, animated: true)
            }

            self.tableView.refreshControl?.endRefreshing()
        }
    }
}
