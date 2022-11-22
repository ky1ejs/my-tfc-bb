import { User, Prisma } from "@prisma/client";
import axios from "axios";
import { TfcError, TfcErrorType } from "../models/TfcError";
import prisma from "../db";
import Auth from "../services/auth";
import { decrypt } from "../services/cipher";

export function getDeliveries(
  user: User
): Promise<Prisma.DeliveryCreateManyInput[]> {
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
        return Promise.reject(new TfcError(TfcErrorType.BAD_GATEWAY));
      }

      return Promise.reject(error);
    }
  );

  return a
    .get("https://connect.tfc.com/api/v1/packages/my-packages/")
    .then((res) => mapTfcDelivery(res.data, user));
}

export async function fetchAndUpdateDeliveries(user: User) {
  const data = await Promise.all([
    prisma.delivery.findMany({
      where: { user_id: user.id, collected_at: null },
    }),
    getDeliveries(user),
  ]);

  const [uncollectedDeliveries, latestDeliveries] = data;

  const latestDeliveryIds = latestDeliveries.map((d) => d.tfc_id);
  const collectedDeliveries = uncollectedDeliveries.filter(
    (cd) => !latestDeliveryIds.includes(cd.tfc_id)
  );

  const uncollectedDeliveryIds = uncollectedDeliveries.map((d) => d.tfc_id);
  const newDeliveries = latestDeliveries.filter(
    (d) => !uncollectedDeliveryIds.includes(d.tfc_id)
  );

  const setCollected = prisma.delivery.updateMany({
    where: { id: { in: collectedDeliveries.map((d) => d.id) } },
    data: {
      collected_at: new Date(),
    },
  });

  const updateRedelivered = prisma.delivery
    .findMany({
      where: { tfc_id: { in: latestDeliveries.map((d) => d.tfc_id) } },
    })
    .then((redelivered) =>
      prisma.delivery.updateMany({
        where: { id: { in: redelivered.map((d) => d.id) } },
        data: { collected_at: null },
      })
    );
  const createDeliveries = prisma.delivery.createMany({
    data: latestDeliveries,
    skipDuplicates: true,
  });
  await Promise.all([updateRedelivered, setCollected, createDeliveries]);
  return {
    collectedDeliveries,
    latestDeliveries,
    newDeliveries,
    user,
  };
}

function mapTfcDelivery(
  data: any,
  user: User
): Prisma.DeliveryCreateManyInput[] {
  const deliveries: any[] = data.results;
  return deliveries.map((d) => {
    return {
      tfc_id: d.id,
      name: d.package_type.name,
      comment: d.opening_comment,
      date_received: new Date(d.date_opened),
      user_id: user.id,
      collected_at: null,
    };
  });
}
