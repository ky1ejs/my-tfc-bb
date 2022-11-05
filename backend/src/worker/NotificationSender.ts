import { Device, User } from "@prisma/client";
import prisma from "../db";

export async function pushToUsersDevices(user: User, message: string) {
  return prisma.device
    .findMany({ where: { user_id: user.id } })
    .then((devices) => devices.map((d) => pushToDevice(d, message)))
    .then((promises) => Promise.all(promises));
}

export async function pushToDevice(device: Device, message: string) {
  console.log(message);
  return "";
}
