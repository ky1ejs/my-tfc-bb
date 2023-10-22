import { User } from "@prisma/client";
import axios from "axios";
import prisma from "../db";
import Auth from "../services/auth";
import { decrypt } from "../services/cipher";
import myTfcEndpoints from "./endpoints";
import { TfcApiError } from "./TfcApiError";
import { parseTfcDeliveries, TfcDelivery } from "./TfcDelivery";

export function getDeliveries(user: User): Promise<TfcDelivery[]> {
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
  const data = await Promise.all([
    prisma.delivery.findMany({
      where: { user_id: user.id, collected_at: null },
    }),
    getDeliveries(user),
  ]);

  const [uncollectedDeliveries, latestTfcDeliveries] = data;

  const latestDeliveryIds = latestTfcDeliveries.map((d) => d.id);
  const collectedDeliveries = uncollectedDeliveries.filter(
    (d) => !latestDeliveryIds.includes(d.tfc_id)
  );

  const uncollectedDeliveryIds = uncollectedDeliveries.map((d) => d.tfc_id);
  const newDeliveries = latestTfcDeliveries.filter(
    (d) => !uncollectedDeliveryIds.includes(d.id)
  );

  const setCollected = prisma.delivery.updateMany({
    where: { id: { in: collectedDeliveries.map((d) => d.id) } },
    data: {
      collected_at: new Date(),
    },
  });
  const createDeliveries = prisma.$transaction(
    latestTfcDeliveries.map((d) =>
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
  const [latestDeliveries] = await Promise.all([
    createDeliveries,
    setCollected,
  ]);
  return {
    collectedDeliveries,
    latestDeliveries,
    newDeliveries,
    user,
  };
}
