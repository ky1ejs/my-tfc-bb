//
//  DevicesViewController.swift
//  My TFC BB
//
//  Created by Kyle Satti on 12/23/22.
//

import UIKit

class DevicesViewController: UITableViewController {
    private var devices = [Device]()

    init() {
        super.init(style: .plain)
        title = "Devices"
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        fetchData()

        let refreshControl = UIRefreshControl()
        refreshControl.addAction(UIAction(handler: { _ in
            self.fetchData()
        }), for: .valueChanged)
        tableView.refreshControl = refreshControl
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
        return devices.count
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cellId = "CELL"
        let cell = tableView.dequeueReusableCell(withIdentifier: cellId) ?? UITableViewCell(style: .default, reuseIdentifier: cellId)
        cell.textLabel?.text = devices[indexPath.row].name
        return cell
    }

    private func fetchData() {
        tableView.refreshControl?.beginRefreshing()
        Task {
            do {
                let response = try await TfcApi.client.getDevices(Empty())
                self.devices = response.devices
                self.tableView.reloadData()
            } catch let error {
                let alert = UIAlertController(title: "Error", message: error.localizedDescription, preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "Damn man...", style: .cancel))
                self.present(alert, animated: true)
            }

            self.tableView.refreshControl?.endRefreshing()
        }
    }
}
