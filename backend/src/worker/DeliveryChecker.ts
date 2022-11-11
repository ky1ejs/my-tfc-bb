import { TfcError } from "../models/TfcError";
import prisma from "../db";
import { fetchAndUpdateDeliveries } from "../my-tfc/get_deliveries";
import { pushToUsersDevices } from "./NotificationSender";

(function schedule() {
  prisma.user
    .findMany()
    .then((users) => Promise.all(users.map(fetchAndUpdateDeliveries)))
    .then((updates) => {
      return updates.map((u) => {
        const promises: Promise<void>[] = [];

        const collectedPackages = u.collectedDeliveries.length;
        const currentPackageCount = u.latestDeliveries.length;
        if (collectedPackages > 0) {
          const title = `${collectedPackages} package${
            collectedPackages > 1 ? "s" : ""
          } collected`;
          const body = `${currentPackageCount} remain to be collected`;
          promises.push(
            pushToUsersDevices(u.user, {
              title,
              body,
              badge: currentPackageCount,
            })
          );
        }

        const newDeliveries = u.newDeliveries.length;
        if (newDeliveries > 0) {
          const title = `${newDeliveries} new ${
            newDeliveries > 1 ? "packages are" : "package is"
          } ready for collection`;
          const body = `${currentPackageCount} ${
            currentPackageCount > 1 ? "packages are" : "package is"
          } for collection in total`;
          promises.push(
            pushToUsersDevices(u.user, {
              title,
              body,
              badge: currentPackageCount,
            })
          );
        }

        return Promise.all(promises);
      });
    })
    .then((promises) => Promise.all(promises))
    .then(function () {
      console.log("Process finished, waiting 2 minutes");
      setTimeout(function () {
        console.log("Going to restart");
        schedule();
      }, 1000 * 60 * 2);
    })
    .catch((err) => {
      console.error("error in scheduler", err);
      if (!(err instanceof TfcError)) {
        throw err;
      }
    });
})();
