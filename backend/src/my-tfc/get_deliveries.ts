import { User, Prisma, PrismaClient } from "@prisma/client";
import axios from "axios";

export function getDeliveries(
  user: User
): Promise<Prisma.DeliveryCreateManyInput[]> {
  return axios
    .get("https://connect.tfc.com/api/v1/packages/my-packages/", {
      headers: {
        Authorization: `Token ${user.latest_access_token}`,
      },
    })
    .then((res) => mapTfcDelivery(res.data, user));
}

export async function fetchAndUpdateDeliveries(user: User) {
  const prisma = new PrismaClient();
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
