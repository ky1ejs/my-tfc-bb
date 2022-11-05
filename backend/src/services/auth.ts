import { DevicePlatform, User } from "@prisma/client";
import prisma from "../db";
import TFC from "../my-tfc";
import { encrypt } from "./cipher";

export default class Auth {
  private tfc = new TFC();

  authDevice(username: string, password: string, deviceId: string) {
    return this.logUserInAndUpsert(username, password).then((user) =>
      this.registerNewDevice(user, deviceId)
    );
  }

  authUser(username: string, password: string) {
    return this.logUserInAndUpsert(username, password);
  }

  private logUserInAndUpsert(username: string, password: string) {
    return this.tfc.login({ username, password }).then((creds) => {
      return prisma.user.upsert({
        where: {
          username: username,
        },
        update: {
          latest_access_token: creds.access_token,
          refresh_token: creds.refresh_token,
          hashed_password: encrypt(password),
        },
        create: {
          username: username,
          latest_access_token: creds.access_token,
          refresh_token: creds.refresh_token,
          hashed_password: encrypt(password),
        },
      });
    });
  }

  private registerNewDevice(user: User, deviceId: string) {
    return prisma.device.upsert({
      where: {
        id: deviceId,
      },
      update: {
        user: {
          connect: {
            id: user.id,
          },
        },
      },
      create: {
        device_provided_id: deviceId,
        platform: DevicePlatform.IOS,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }
}
