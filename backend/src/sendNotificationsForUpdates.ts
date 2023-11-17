import { User } from "@prisma/client";
import {
  formattedCourierName,
  identifyCourier,
} from "./helpers/identifyCourier";
import { DeliveryUpdates } from "./my-tfc/get_deliveries";
import { pushToUsersDevices } from "./worker/NotificationSender";

export async function sendNotificationsForUpdates(
  updates: DeliveryUpdates,
  user: User
): Promise<void> {
  const promises: Promise<void>[] = [];

  const collectedPackages = updates.collectedDeliveries.length;
  const currentPackageCount = updates.uncollectedDeliveries.length;
  if (collectedPackages > 0) {
    let title: string;
    let body: string;

    if (currentPackageCount <= 0) {
      title = "All packages collected";
      body =
        collectedPackages > 1
          ? `✅ ${collectedPackages} packages have been collected`
          : "✅ 1 package has been collected";
    } else {
      title = `${collectedPackages} package${
        collectedPackages > 1 ? "s" : ""
      } collected`;
      body = `${currentPackageCount} remain to be collected`;
    }

    promises.push(
      pushToUsersDevices(user, {
        title,
        body,
        badge: currentPackageCount,
      })
    );
  }

  const newDeliveries = updates.newDeliveries.length;
  if (newDeliveries > 0) {
    const title = `${newDeliveries} ${
      newDeliveries > 1 ? "packages" : "package"
    } delivered`;

    let body: string;

    if (newDeliveries > 1) {
      body = `${currentPackageCount} ${
        currentPackageCount > 1 ? "packages" : "package"
      } waiting for collection in total`;
    } else {
      const courier = identifyCourier(updates.newDeliveries[0].name);
      const courierName = formattedCourierName(courier);
      body = `New delivery from ${courierName}. ${currentPackageCount} ${
        currentPackageCount > 1 ? "packages" : "package"
      } waiting for collection in total.`;
    }

    promises.push(
      pushToUsersDevices(updates.user, {
        title,
        body,
        badge: currentPackageCount,
      })
    );
  }

  await Promise.all(promises);
}
