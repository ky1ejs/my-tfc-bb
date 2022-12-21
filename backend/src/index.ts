// import "source-map-support/register"; // TODO: what does this do? It was introducted by this grpc example:
import { bootService } from "./MyTfcServer";
import { Worker } from "worker_threads";

const PORT = process.env.PORT || 3000;
const RUN_DELIVERY_CHECK =
  (process.env.RUN_DELIVERY_CHECK ?? "true") === "true";

if (RUN_DELIVERY_CHECK) {
  new Worker(require.resolve(`./worker/DeliveryChecker`), {
    execArgv: ["-r", "ts-node/register"],
  });
}

bootService(PORT);
