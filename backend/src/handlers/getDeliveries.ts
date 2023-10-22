import { handleUnaryCall } from "@grpc/grpc-js";
import { Delivery } from "@prisma/client";
import { Delivery as DeliveryProto } from "../generated/proto/my_tfc_bb/v1/my_tfc_bb";
import { handleError } from "../errors/HandleGrpcError";
import {
  GetDeliveriesRequest,
  GetDeliveriesResponse,
} from "../generated/proto/my_tfc_bb/v1/my_tfc_bb";
import { authenticate } from "../helpers/authenticate";
import { fetchAndUpdateDeliveries } from "../my-tfc/get_deliveries";
import { logRequest } from "../helpers/logRequest";
import { identifyCourier } from "../helpers/identifyCourier";

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
    identifiedCourier: identifyCourier(d.name),
  };
}
