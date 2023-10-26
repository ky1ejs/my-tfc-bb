import prisma from "../db";
import { fetchAndUpdateDeliveries } from "../my-tfc/get_deliveries";
import { pushToUsersDevices } from "./NotificationSender";
import { DateTime } from "luxon";
import { TfcApiError, TfcApiErrorType } from "../my-tfc/TfcApiError";
import { Delivery, PasswordStatus, User } from "@prisma/client";
import { TfcDelivery } from "../my-tfc/TfcDelivery";
import {
  formattedCourierName,
  identifyCourier,
} from "../helpers/identifyCourier";

const COLLECTION_CLOSE = 22; // 10pm
const COLLECTION_OPEN = 7; // 7am
const WHILE_CLOSED_CHECK_INTERVAL = 15; // minutes
const WHILE_OPEN_CHECK_INTERVAL = 2; // minutes

let intervalMinutes = WHILE_OPEN_CHECK_INTERVAL;

const start = () => {
  process()
    .then(schedule)
    .catch((err) => {
      console.error("error in scheduler", err);
      if (err instanceof TfcApiError) {
        schedule();
        return;
      }
      throw err;
    });
};

function schedule() {
  console.log(
    `Delivery check finished, waiting ${intervalMinutes} minute${
      intervalMinutes > 1 ? "s" : ""
    }`
  );
  setTimeout(function () {
    console.log("Going to restart");
    start();
  }, 1000 * 60 * intervalMinutes);
}

function process(): Promise<void> {
  console.log("Delivery check started.");

  const nowHour = DateTime.now().setZone("America/New_York").hour;
  if (nowHour >= COLLECTION_CLOSE || nowHour < COLLECTION_OPEN) {
    console.log(`Parcel room is closed, skipping.`);
    intervalMinutes = WHILE_CLOSED_CHECK_INTERVAL;
    return Promise.resolve();
  }

  intervalMinutes = WHILE_OPEN_CHECK_INTERVAL;
  return prisma.user
    .findMany({ where: { password_status: PasswordStatus.VALID } })
    .then((users) => users.map(processUpdatesForUser))
    .then((promises) => Promise.all(promises))
    .then(undefined); // map to void;
}

async function processUpdatesForUser(user: User): Promise<void> {
  try {
    const updates = await fetchAndUpdateDeliveries(user);
    await sendNotificationsForUpdates(updates);
  } catch (error) {
    if (error instanceof TfcApiError) {
      if (error.type === TfcApiErrorType.INVALID_PASSWORD) {
        await prisma.user
          .update({
            where: { id: user.id },
            data: { password_status: PasswordStatus.INVALID },
          })
          .then(() =>
            pushToUsersDevices(user, {
              title: "Can't update your packages",
              body: "It seems your authentications details are no longer valid.",
            })
          );
      }
    }
  }
}

async function sendNotificationsForUpdates(update: {
  collectedDeliveries: Delivery[];
  uncollectedDeliveries: Delivery[];
  newDeliveries: TfcDelivery[];
  user: User;
}): Promise<void> {
  const promises: Promise<void>[] = [];

  const collectedPackages = update.collectedDeliveries.length;
  const currentPackageCount = update.uncollectedDeliveries.length;
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
      pushToUsersDevices(update.user, {
        title,
        body,
        badge: currentPackageCount,
      })
    );
  }

  const newDeliveries = update.newDeliveries.length;
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
      const courier = identifyCourier(update.newDeliveries[0].name);
      const courierName = formattedCourierName(courier);
      body = `New delivery from ${courierName}. ${currentPackageCount} ${
        currentPackageCount > 1 ? "packages" : "package"
      } waiting for collection in total.`;
    }

    promises.push(
      pushToUsersDevices(update.user, {
        title,
        body,
        badge: currentPackageCount,
      })
    );
  }

  await Promise.all(promises);
}

start();
