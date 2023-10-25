//
//  My_TFC_BB_Widget.swift
//  My TFC BB Widget
//
//  Created by Kyle Satti on 10/23/23.
//

import WidgetKit
import SwiftUI
import tfc_bb_core

struct Provider: TimelineProvider {
    private let api = TfcApi.shared

    func placeholder(in context: Context) -> DeliveryCount {
        return DeliveryCount(state: .latestData(4), date: .now)
    }

    func getSnapshot(in context: Context, completion: @escaping (DeliveryCount) -> ()) {
        loadData(completion: completion)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        loadData { delivery in
            let timeline = Timeline(entries: [delivery], policy: .after(.now.addingTimeInterval(60 * 10))) // reload every 10 mins
            completion(timeline)
        }
    }

    private func loadData(completion: @escaping (DeliveryCount) -> ()) {
        Task {
            guard TfcApi.shared.authenticationState == .authenticated else {
                completion(DeliveryCount(
                    state: .notLoggedIn,
                    date: .now
                ))
                return 
            }
            do {
                let response = try await api.client.getDeliveries(MyTfcBb_V1_GetDeliveriesRequest())
                completion(DeliveryCount(
                    state: .latestData(response.deliveries.count),
                    date: .now
                ))
            } catch {
                completion(DeliveryCount(
                    state: .error(error),
                    date: .now)
                )
            }
        }
    }
}

struct DeliveryCount: TimelineEntry {
    enum State {
        case notLoggedIn
        case error(Error)
        case latestData(Int)
    }
    let state: State
    let date: Date
}

struct MyTFCBBWidget : View {
    var entry: Provider.Entry
    @Environment(\.widgetFamily) var family

    var body: some View {
        switch family {
        case .accessoryCircular: CircularWidget(entry: entry)
        case .systemSmall: SmallWidget(entry: entry)
        default: fatalError("Unsupported widget family")
        }
    }
}

struct CircularWidget : View {
    var entry: Provider.Entry

    var body: some View {
        ZStack {
            AccessoryWidgetBackground()
            switch entry.state {
            case .notLoggedIn: Text("log in")
            case .error: Text("error")
            case .latestData(let deliveryCount):
                if deliveryCount == 0 {
                    Text("📦: ✅")
                } else {
                    Text("📦: \(deliveryCount)")
                }
            }
        }
    }
}

struct SmallWidget : View {
    var entry: Provider.Entry

    var body: some View {
        ZStack {
            AccessoryWidgetBackground()
            switch entry.state {
            case .notLoggedIn: Text("log in")
            case .error(let error):
                Text("❗️").font(.title2).foregroundStyle(.black)
                Text(error.localizedDescription).foregroundStyle(.black)
            case .latestData(let deliveryCount):
                HStack {
                    VStack(alignment: .leading) {
                        Text("📦 TFC").font(.headline).padding(.bottom, 12)
                        if deliveryCount == 0 {
                            Text("✅")
                                .font(.title)
                                .foregroundStyle(.black)
                            Text("all pacakages collected")
                                .font(.footnote)
                                .foregroundStyle(Color(uiColor: .darkGray))
                        } else {
                            Text("\(deliveryCount)").font(.title)
                                .foregroundStyle(.black)
                            Text("ready for you to collect")
                                .font(.footnote)
                                .foregroundStyle(Color(uiColor: .darkGray))
                        }
                        Spacer()
                    }
                    Spacer()
                }
            }
        }
    }
}

struct My_TFC_BB_Widget: Widget {
    let kind: String = "My_TFC_BB_Widget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            MyTFCBBWidget(entry: entry)
                .containerBackground(for: .widget) { Color(uiColor: .lightOrange) }
        }
        .configurationDisplayName("My Widget")
        .description("This is an example widget.")
        .supportedFamilies([.accessoryCircular, .systemSmall])
    }
}

struct FakeError: Error {}

#Preview(as: .accessoryCircular) {
    My_TFC_BB_Widget()
} timeline: {
    DeliveryCount(state: .latestData(0), date: .now)
    DeliveryCount(state: .latestData(5), date: .now)
    DeliveryCount(state: .notLoggedIn, date: .now)
    DeliveryCount(state: .error(FakeError()), date: .now)
}

#Preview(as: .systemSmall) {
    My_TFC_BB_Widget()
} timeline: {
    DeliveryCount(state: .latestData(0), date: .now)
    DeliveryCount(state: .latestData(5), date: .now)
    DeliveryCount(state: .notLoggedIn, date: .now)
    DeliveryCount(state: .error(FakeError()), date: .now)
}
