// import "source-map-support/register"; // TODO: what does this do? It was introducted by this grpc example:
import { Server } from "@grpc/grpc-js";
import { bootService } from "./MyTfcServer";
import { Worker } from "worker_threads";

const RUN_DELIVERY_CHECK =
  (process.env.RUN_DELIVERY_CHECK ?? "true") === "true";

let worker: Worker | null = null;
let server: Server | null = null;
if (RUN_DELIVERY_CHECK) {
  worker = new Worker(require.resolve(`./worker/DeliveryChecker`));
}

const shutdown = async () => {
  console.log("Shutting down gracefully...");
  // Perform cleanup tasks here
  if (worker) {
    await worker.terminate();
  }
  if (server) {
    await new Promise<void>((resolve, reject) => {
      server?.tryShutdown((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

server = bootService();
