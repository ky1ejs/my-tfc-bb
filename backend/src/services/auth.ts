import { DevicePlatform, PrismaClient, User } from "@prisma/client";
import TFC from "../my-tfc";

export default class Auth {
  private tfc = new TFC();
  private prisma = new PrismaClient();

  auth(username: string, password: string, deviceId: string) {
    return this.logUserInAndUpsert(username, password).then((user) =>
      this.registerNewDevice(user, deviceId)
    );
  }

  private logUserInAndUpsert(username: string, password: string) {
    return this.tfc.login({ username, password }).then((creds) => {
      return this.prisma.user.upsert({
        where: {
          username: username,
        },
        update: {
          latest_access_token: creds.access_token,
          refresh_token: creds.refresh_token,
        },
        create: {
          username: username,
          latest_access_token: creds.access_token,
          refresh_token: creds.refresh_token,
        },
      });
    });
  }

  private registerNewDevice(user: User, deviceId: string) {
    return this.prisma.device.upsert({
      where: {
        id: deviceId
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
