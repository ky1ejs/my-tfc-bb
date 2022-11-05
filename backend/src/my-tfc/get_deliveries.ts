import { User, Prisma } from "@prisma/client";
import axios from "axios";
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
      return Promise.reject(error);
    }
  );

  return a
    .get("https://connect.tfc.com/api/v1/packages/my-packages/")
    .then((res) => mapTfcDelivery(res.data, user));
}

export async function fetchAndUpdateDeliveries(user: User) {
  const data = await Promise.all([
    prisma.delivery.findMany({ where: { user_id: user.id } }),
    getDeliveries(user),
  ]);

  const [deliveriesInDatabase, latestDeliveries] = data;
  const latestDeliveryIds = latestDeliveries.map((d) => d.tfc_id);
  const collectedDeliveries = deliveriesInDatabase.filter((d) =>
    latestDeliveryIds.includes(d.tfc_id)
  );

  const deleteDeliveries = prisma.delivery.deleteMany({
    where: { id: { in: collectedDeliveries.map((d) => d.id) } },
  });
  const createDeliveries = prisma.delivery.createMany({
    data: latestDeliveries,
    skipDuplicates: true,
  });
  await Promise.all([deleteDeliveries, createDeliveries]);
  return {
    collectedDeliveries,
    latestDeliveries,
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
    };
  });
}
