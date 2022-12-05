import * as grpc from "../generated/proto/my-tfc-bb";
import { PushPlatform } from "@prisma/client";
import { MyTfcBbError } from "../errors/MyTfcBbError";

export function pushPlatformFromProto(platform: grpc.PushPlatform): PushPlatform {
  switch (platform) {
    case grpc.PushPlatform.android:
      return PushPlatform.ANDROID
    case grpc.PushPlatform.ios:
      return PushPlatform.IOS
    case grpc.PushPlatform.web:
      return PushPlatform.WEB
    case grpc.PushPlatform.UNRECOGNIZED:
      throw MyTfcBbError.badRequest()
  }
}
