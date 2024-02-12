import { ServerUnaryCall } from "@grpc/grpc-js";
import { Device, User } from "@prisma/client";
import prisma from "../db";
import { MyTfcBbError, MyTfcBbErrorType } from "../errors/MyTfcBbError";

export function authenticate<T, V>(
  call: ServerUnaryCall<T, V>
): Promise<Device & { User: User }> {
  return prisma.device
    .findUniqueOrThrow({
      include: { User: true },
      where: { id: getDeviceIdFromRequest(call) },
    })
    .catch(() => {
      throw new MyTfcBbError(MyTfcBbErrorType.UNAUTHENTICATED);
    });
}

export function getDeviceIdFromRequest<T, V>(
  call: ServerUnaryCall<T, V>
): string {
  return call.metadata.getMap()["device_id"]?.toString() ?? "";
}
