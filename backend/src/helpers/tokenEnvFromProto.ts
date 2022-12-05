import * as grpc from "../generated/proto/my_tfc_bb/v1/my_tfc_bb";
import { TokenEnv } from "@prisma/client";
import { MyTfcBbError } from "../errors/MyTfcBbError";

export function tokenEnvFromProto(env: grpc.TokenEnv): TokenEnv {
  switch (env) {
    case grpc.TokenEnv.PRODUCTION:
      return TokenEnv.PRODUCTION;
    case grpc.TokenEnv.STAGING:
      return TokenEnv.STAGING;
    case grpc.TokenEnv.UNRECOGNIZED:
    case grpc.TokenEnv.TOKEN_ENV_UNSPECIFIED:
      throw MyTfcBbError.badRequest();
  }
}


