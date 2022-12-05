import * as grpc from "../generated/proto/my_tfc_bb/v1/my_tfc_bb";
import { PushPlatform } from "@prisma/client";
import { MyTfcBbError } from "../errors/MyTfcBbError";

export function pushPlatformFromProto(platform: grpc.PushPlatform): PushPlatform {
  switch (platform) {
    case grpc.PushPlatform.ANDROID:
      return PushPlatform.ANDROID
    case grpc.PushPlatform.IOS:
      return PushPlatform.IOS
    case grpc.PushPlatform.WEB:
      return PushPlatform.WEB
    case grpc.PushPlatform.UNRECOGNIZED:
    case grpc.PushPlatform.PUSH_PLATFORM_UNSPECIFIED:
      throw MyTfcBbError.badRequest()
  }
}
