//
//  DeliveriesViewController.swift
//  My TFC BB
//
//  Created by Kyle Satti on 11/3/22.
//

import UIKit

class DeliveresViewController: UITableViewController {
    private let client = HTTPClient.authorizedClient
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
        fetchData()
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
        let cellId = "CELL"
        let cell = tableView.dequeueReusableCell(withIdentifier: cellId) ?? UITableViewCell(style: .default, reuseIdentifier: cellId)
        cell.textLabel?.text = deliveries[indexPath.row].name
        return cell
    }

    private func fetchData() {
        Task {
            switch await client.call(endpoint: GetDeliveriesEndpoint()) {
            case .success(let result):
                self.deliveries = result.deliveries
                self.tableView.reloadData()
            case .failure(let error):
                let alert = UIAlertController(title: "Error", message: error.localizedDescription, preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "Damn man...", style: .cancel))
                self.present(alert, animated: true)
            }
        }
    }
}
