import { handleUnaryCall } from "@grpc/grpc-js";
import { logRequest } from "../helpers/logRequest";
import prisma from "../db";
import { handleError } from "../errors/HandleGrpcError";
import { Empty } from "../generated/proto/google/protobuf/empty";
import {
  UpdatePushTokenRequest,
} from "../generated/proto/my-tfc-bb";
import { authenticate } from "../helpers/authenticate";
import { tokenEnvFromProto } from "../helpers/tokenEnvFromProto";
import { pushPlatformFromProto } from "../helpers/pushPlatformFromProto";

export const updatePushTokenHandler: handleUnaryCall<
  UpdatePushTokenRequest,
  Empty
> = (call, callback) => {
  return logRequest(call)
    .then(authenticate)
    .then((device) => {
      return {
        device,
        env: tokenEnvFromProto(call.request.env),
        platform: pushPlatformFromProto(call.request.platform),
      };
    })
    .then(({ device, env, platform }) => {
      return prisma.pushToken.upsert({
        where: { device_id: device.id },
        create: {
          token: call.request.token,
          platform: platform,
          env: env,
          device: {
            connect: {
              id: device.id,
            },
          },
        },
        update: {
          token: call.request.token,
          env: env,
        },
      });
    })
    .catch((e) => handleError(e, callback));
};

