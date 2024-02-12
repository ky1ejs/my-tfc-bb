import { PushPlatform, PushToken, User } from "@prisma/client";
import { PushMessage, sendPush } from "./apns";
import prisma from "../db";

export async function pushToUsersDevices(
  user: User,
  message: PushMessage
): Promise<void> {
  return prisma.device
    .findMany({ where: { user_id: user.id }, include: { PushToken: true } })
    .then((devices) => devices.map((d) => d.PushToken))
    .then((tokens) => tokens.filter((t): t is PushToken => t !== null))
    .then((tokens) => tokens.map((t) => pushToDevice(t, message)))
    .then((promises) => Promise.all(promises))
    .then(() => undefined); // map to void
}

export async function pushToDevice(
  token: PushToken,
  message: PushMessage
): Promise<void> {
  console.log(message);
  switch (token.platform) {
    case PushPlatform.IOS:
      return sendPush(token, message);
    default:
      return Promise.resolve();
  }
}
