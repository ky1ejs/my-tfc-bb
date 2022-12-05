import { UntypedHandleCall } from "@grpc/grpc-js";
import { MyTfcServer } from "./generated/proto/my-tfc-bb";
import { getDeliveriesHandler } from "./handlers/getDeliveries";
import { logInHandler } from "./handlers/logIn";
import { logOutHandler } from "./handlers/logOut";
import { sendTestPushNoticationHandler } from "./handlers/sendTestPushNotication";
import { updatePushTokenHandler } from "./handlers/updatePushToken";

export class MyTfcServiceImpl implements MyTfcServer {
  [method: string]: UntypedHandleCall;

  logIn = logInHandler;
  getDeliveries = getDeliveriesHandler;
  updatePushToken = updatePushTokenHandler;
  sendTestPushNotication = sendTestPushNoticationHandler;
  logOut = logOutHandler;
}
