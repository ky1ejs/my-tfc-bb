import { User, Delivery } from "@prisma/client";
import axios from "axios";
import prisma from "../db";
import Auth from "../services/auth";
import { decrypt } from "../services/cipher";
import myTfcEndpoints from "./endpoints";
import { TfcApiError } from "./TfcApiError";
import { parseTfcDeliveries, TfcDelivery } from "./TfcDelivery";
import { sendNotificationsForUpdates } from "../sendNotificationsForUpdates";

function getDeliveries(user: User): Promise<TfcDelivery[]> {
  const a = axios.create();
  a.defaults.headers.common = {
    Authorization: `Token ${user.latest_access_token}`,
  };

  a.interceptors.response.use(
    (response) => {
      return response;
    },
    function (error) {
      const originalRequest = error.config;
      if (
        originalRequest &&
        !originalRequest._retry &&
        error.response.status === 403
      ) {
        originalRequest._retry = true;
        return new Auth()
          .authUser(user.username, decrypt(user.hashed_password))
          .then((user) => {
            originalRequest.headers = {
              Authorization: `Token ${user.latest_access_token}`,
            };
            return a(originalRequest);
          });
      }

      if (error.response.status === 502) {
        return Promise.reject(TfcApiError.badGateway());
      }

      return Promise.reject(error);
    }
  );

  return a
    .get(myTfcEndpoints.delivereies)
    .then((res) => parseTfcDeliveries(res.data));
}

export async function fetchAndUpdateDeliveries(user: User) {
  const updates = await updateDeliveries(user);
  await sendNotificationsForUpdates(updates, user);
  return updates;
}

export type DeliveryUpdates = {
  collectedDeliveries: Delivery[];
  uncollectedDeliveries: Delivery[];
  newDeliveries: TfcDelivery[];
  user: User;
};

async function updateDeliveries(user: User): Promise<DeliveryUpdates> {
  const data = await Promise.all([
    prisma.delivery.findMany({
      where: { user_id: user.id, collected_at: null },
    }),
    getDeliveries(user),
  ]);

  const [uncollectedInDatabase, uncollectedInTFC] = data;

  const latestDeliveryIds = uncollectedInTFC.map((d) => d.id);
  const collectedDeliveries = uncollectedInDatabase.filter(
    (d) => !latestDeliveryIds.includes(d.tfc_id)
  );

  const uncollectedDeliveryIds = uncollectedInDatabase.map((d) => d.tfc_id);
  const newDeliveries = uncollectedInTFC.filter(
    (d) => !uncollectedDeliveryIds.includes(d.id)
  );

  const setCollected = prisma.delivery.updateMany({
    where: { id: { in: collectedDeliveries.map((d) => d.id) } },
    data: {
      collected_at: new Date(),
    },
  });
  const upsertUncollectedDeliveries = prisma.$transaction(
    uncollectedInTFC.map((d) =>
      prisma.delivery.upsert({
        where: { tfc_id_user_id: { user_id: user.id, tfc_id: d.id } },
        create: {
          name: d.name,
          date_received: d.date_received,
          tfc_id: d.id,
          user_id: user.id,
        },
        update: {
          collected_at: null,
          name: d.name,
        },
      })
    )
  );
  const [uncollectedDeliveries] = await Promise.all([
    upsertUncollectedDeliveries,
    setCollected,
  ]);
  return {
    collectedDeliveries,
    uncollectedDeliveries,
    newDeliveries,
    user,
  };
}
