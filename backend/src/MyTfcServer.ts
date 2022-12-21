import { UntypedHandleCall } from "@grpc/grpc-js";
import { MyTfcServer } from "./generated/proto/my_tfc_bb/v1/my_tfc_bb";
import { getDeliveriesHandler } from "./handlers/getDeliveries";
import { logInHandler } from "./handlers/logIn";
import { logOutHandler } from "./handlers/logOut";
import { sendTestPushNoticationHandler } from "./handlers/sendTestPushNotication";
import { updatePushTokenHandler } from "./handlers/updatePushToken";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { MyTfcService } from "./generated/proto/my_tfc_bb/v1/my_tfc_bb";

export class MyTfcServiceImpl implements MyTfcServer {
  [method: string]: UntypedHandleCall;

  logIn = logInHandler;
  getDeliveries = getDeliveriesHandler;
  updatePushToken = updatePushTokenHandler;
  sendTestPushNotication = sendTestPushNoticationHandler;
  logOut = logOutHandler;
}

export function bootService(port: string | number): Server {
  const server = new Server({
    "grpc.max_receive_message_length": -1,
    "grpc.max_send_message_length": -1,
  });

  server.addService(MyTfcService, new MyTfcServiceImpl());
  server.bindAsync(
    `0.0.0.0:${port}`,
    ServerCredentials.createInsecure(),
    (err: Error | null) => {
      if (err) {
        throw err;
      }
      console.log(`🛰️  Listening on port ${port}`);
      server.start();
    }
  );
  console.log("booted");
  return server;
}
