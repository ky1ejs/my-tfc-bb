import * as grpc from "../generated/proto/my-tfc-bb";
import { TokenEnv } from "@prisma/client";
import { MyTfcBbError } from "../errors/MyTfcBbError";

export function tokenEnvFromProto(env: grpc.TokenEnv): TokenEnv {
  switch (env) {
    case grpc.TokenEnv.production:
      return TokenEnv.PRODUCTION;
    case grpc.TokenEnv.staging:
      return TokenEnv.STAGING;
    case grpc.TokenEnv.UNRECOGNIZED:
      throw MyTfcBbError.badRequest();
  }
}


