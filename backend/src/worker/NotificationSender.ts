import { Device, User } from "@prisma/client";

export class NotificationSender {
  async sendNotification(device: Device | User, message: string) {
    return "";
  }
}
