import { handleUnaryCall } from "@grpc/grpc-js";
import prisma from "../db";
import { Empty } from "../generated/proto/google/protobuf/empty";
import { RemoveDeviceRequest } from "../generated/proto/my_tfc_bb/v1/my_tfc_bb";
import { authenticate } from "../helpers/authenticate";
import { logRequest } from "../helpers/logRequest";

export const removeDeviceHandler: handleUnaryCall<
  RemoveDeviceRequest,
  Empty
> = (call, callback) => {
  return logRequest(call)
    .then(authenticate)
    .then(({ id: device_id }) =>
      prisma.device.delete({ where: { id: device_id } })
    )
    .then(() => callback(null, {}));
};
