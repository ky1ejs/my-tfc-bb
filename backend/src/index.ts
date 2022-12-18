// import "source-map-support/register"; // TODO: what does this do? It was introducted by this grpc example:
import { Worker } from "worker_threads";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { MyTfcServiceImpl } from "./MyTfcServer";
import { MyTfcService } from "./generated/proto/my_tfc_bb/v1/my_tfc_bb";

const PORT = process.env.PORT || 3000;
const RUN_DELIVERY_CHECK =
  (process.env.RUN_DELIVERY_CHECK ?? "true") === "true";

if (RUN_DELIVERY_CHECK) {
  new Worker(require.resolve(`./worker/DeliveryChecker`), {
    execArgv: ["-r", "ts-node/register"],
  });
}

const server = new Server({
  "grpc.max_receive_message_length": -1,
  "grpc.max_send_message_length": -1,
});

server.addService(MyTfcService, new MyTfcServiceImpl());
server.bindAsync(
  `0.0.0.0:${PORT}`,
  ServerCredentials.createInsecure(),
  (err: Error | null) => {
    if (err) {
      throw err;
    }
    console.log(`🛰️  Listening on port ${PORT}`);
    server.start();
  }
);
