import { handleUnaryCall } from "@grpc/grpc-js";
import { logRequest } from "../helpers/logRequest";
import prisma from "../db";
import { handleError } from "../errors/HandleGrpcError";
import { Empty } from "../generated/proto/google/protobuf/empty";
import { authenticate } from "../helpers/authenticate";
import { pushToDevice } from "../services/NotificationSender";

export const sendTestPushNoticationHandler: handleUnaryCall<Empty, Empty> = (
  call,
  callback
) => {
  return logRequest(call)
    .then(authenticate)
    .then(({ id }) =>
      prisma.pushToken.findUniqueOrThrow({ where: { device_id: id } })
    )
    .then((token) =>
      pushToDevice(token, {
        title: "Testing 123",
        body: "Can you hear me?",
      })
    )
    .then(() => callback(null, {}))
    .catch((e) => handleError(e, callback));
};
