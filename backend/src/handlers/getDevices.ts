import { handleUnaryCall } from "@grpc/grpc-js";
import { Device } from "@prisma/client";
import prisma from "../db";
import { Empty } from "../generated/proto/google/protobuf/empty";
import {
  GetDevicesResponse,
  Device as DeviceProto,
} from "../generated/proto/my_tfc_bb/v1/my_tfc_bb";
import { authenticate } from "../helpers/authenticate";
import { logRequest } from "../helpers/logRequest";

export const getDeliveriesHandler: handleUnaryCall<
  Empty,
  GetDevicesResponse
> = (call, callback) => {
  return logRequest(call)
    .then(authenticate)
    .then(({ user: { id: uid } }) =>
      prisma.device.findMany({ where: { user_id: uid } })
    )
    .then((devices) => devices.map(deliveryToProto))
    .then((devices) => callback(null, { devices }));
};

function deliveryToProto(d: Device): DeviceProto {
  return {
    id: d.id,
    name: d.name,
  };
}
