import { handleUnaryCall } from "@grpc/grpc-js";
import { Delivery } from "@prisma/client";
import {
  Courier,
  Delivery as DeliveryProto,
} from "../generated/proto/my_tfc_bb/v1/my_tfc_bb";
import { handleError } from "../errors/HandleGrpcError";
import {
  GetDeliveriesRequest,
  GetDeliveriesResponse,
} from "../generated/proto/my_tfc_bb/v1/my_tfc_bb";
import { authenticate } from "../helpers/authenticate";
import { fetchAndUpdateDeliveries } from "../my-tfc/get_deliveries";
import { logRequest } from "../helpers/logRequest";

export const getDeliveriesHandler: handleUnaryCall<
  GetDeliveriesRequest,
  GetDeliveriesResponse
> = (call, callback) => {
  return logRequest(call)
    .then(authenticate)
    .then(({ user }) => fetchAndUpdateDeliveries(user))
    .then(({ latestDeliveries }) => {
      callback(null, {
        deliveries: latestDeliveries.map(deliveryToProto),
        collectedCount: 0,
        uncollectedCount: latestDeliveries.length,
      });
    })
    .catch((e) => handleError(e, callback));
};

function deliveryToProto(d: Delivery): DeliveryProto {
  return {
    id: d.id,
    name: d.name,
    comment: d.comment,
    dateReceived: d.date_received,
    collectedAt: d.collected_at ?? undefined,
    bookedInByFirstName: d.booked_in_by_first_name,
    bookedInByLastName: d.booked_in_by_last_name,
    identifiedCourier: identifyCourier(d.name),
  };
}

function identifyCourier(deliveryName: string): Courier {
  const text = deliveryName.toLowerCase();
  const searchTerms = new Map<Courier, string[]>([
    [Courier.AMAZON, ["amazon", "laser ship"]],
    [Courier.FEDEX, ["fedex"]],
    [Courier.UPS, ["ups"]],
    [Courier.USPS, ["usps"]],
  ]);

  const identifiedCourier = Array.from(searchTerms.keys()).find((c) =>
    searchTerms.get(c)?.find((t) => {
      if (text.includes(t)) return c;
    })
  );

  return identifiedCourier ?? Courier.UNIDENTIFIED;
}
