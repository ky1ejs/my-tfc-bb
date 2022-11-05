import prisma from "../db";
import { fetchAndUpdateDeliveries } from "../my-tfc/get_deliveries";
import { NotificationSender } from "./NotificationSender";

(function schedule() {
  const notif = new NotificationSender();
  prisma.user
    .findMany()
    .then((users) => Promise.all(users.map(fetchAndUpdateDeliveries)))
    .then((updates) => {
      return updates.map((u) => {
        const collectedPackages = u.collectedDeliveries.length;
        if (collectedPackages > 0) {
          return notif.sendNotification(
            u.user,
            `${collectedPackages} package${
              collectedPackages > 1 ? "s" : ""
            } collected`
          );
        } else {
          return Promise.resolve("undefined");
        }
      });
    })
    .then((promises) => Promise.all(promises))
    .then(function () {
      console.log("Process finished, waiting 1 minute");
      setTimeout(function () {
        console.log("Going to restart");
        schedule();
      }, 1000 * 60);
    })
    .catch((err) => {
      console.error("error in scheduler", err);
      throw err;
    });
})();
