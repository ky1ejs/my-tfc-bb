import { handleUnaryCall } from "@grpc/grpc-js";
import { handleError } from "../errors/HandleGrpcError";
import {
  GetDeliveriesRequest,
  GetDeliveriesResponse,
} from "../generated/proto/my_tfc_bb/v1/my_tfc_bb";
import { authenticate } from "../helpers/authenticate";
import { fetchAndUpdateDeliveries } from "../my-tfc/get_deliveries";
import { logRequest } from "../helpers/logRequest";
import { deliveryToProto } from "../helpers/deliveryToProto";

export const getDeliveriesHandler: handleUnaryCall<
  GetDeliveriesRequest,
  GetDeliveriesResponse
> = (call, callback) => {
  return logRequest(call)
    .then(authenticate)
    .then(({ user }) => fetchAndUpdateDeliveries(user))
    .then(({ uncollectedDeliveries }) => {
      callback(null, {
        deliveries: uncollectedDeliveries.map(deliveryToProto),
        collectedCount: 0,
        uncollectedCount: uncollectedDeliveries.length,
      });
    })
    .catch((e) => handleError(e, callback));
};
