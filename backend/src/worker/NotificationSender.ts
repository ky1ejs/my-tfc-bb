import { PushPlatform, PushToken, User } from "@prisma/client";
import { sendPush } from "../services/apns";
import prisma from "../db";

export async function pushToUsersDevices(
  user: User,
  title: string,
  body: string
) {
  return prisma.device
    .findMany({ where: { user_id: user.id }, include: { push_token: true } })
    .then((devices) => devices.map((d) => d.push_token))
    .then((tokens) => tokens.filter((t): t is PushToken => t !== null))
    .then((tokens) => tokens.map((t) => pushToDevice(t, title, body)))
    .then((promises) => Promise.all(promises));
}

export async function pushToDevice(
  token: PushToken,
  title: string,
  message: string
): Promise<void> {
  console.log(message);
  switch (token.platform) {
    case PushPlatform.IOS:
      return sendPush(token, title, message);
    default:
      return Promise.resolve();
  }
}
