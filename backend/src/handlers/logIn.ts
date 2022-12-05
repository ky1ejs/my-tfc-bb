import { handleUnaryCall } from "@grpc/grpc-js";
import { handleError } from "../errors/HandleGrpcError";
import { LogInRequest, LogInResponse } from "../generated/proto/my_tfc_bb/v1/my_tfc_bb";
import { logRequest } from "../helpers/logRequest";
import Auth from "../services/auth";

export const logInHandler: handleUnaryCall<LogInRequest, LogInResponse> = (
  call,
  callback
) => {
  const { username, password, deviceId } = call.request;
  return logRequest(call)
    .then(() => new Auth().authDevice(username, password, deviceId))
    .then(({ id }) => callback(null, { deviceId: id }))
    .catch((error) => handleError(error, callback));
};
