import { handleUnaryCall } from "@grpc/grpc-js";
import { logRequest } from "../helpers/logRequest";
import prisma from "../db";
import { Empty } from "../generated/proto/google/protobuf/empty";
import { authenticate } from "../helpers/authenticate";

export const logOutHandler: handleUnaryCall<Empty, Empty> = (
  call,
  callback
) => {
  return logRequest(call)
    .then(authenticate)
    .then(({id}) => prisma.device.delete({where: {id: id}}))
    .then(() => callback(null))
};
