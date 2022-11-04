import express from "express";
import cors from "cors";
import Auth from "./services/auth";
import { PrismaClient } from "@prisma/client";
import { Worker } from "worker_threads";
import { fetchAndUpdateDeliveries } from "./my-tfc/get_deliveries";

const port = process.env.PORT || 3000;
const app = express();
app.use(cors({ credentials: true, exposedHeaders: ["set-cookie"] }));
app.use(express.json());

app.use(function (req, res, next) {
  console.log("Time:", Date.now());

  console.log("Request URL:", req.originalUrl);
  console.log("Request Type:", req.method);
  console.log("----");
  next();
});

app.post("/my-tfc/v1/login", async (req, res) => {
  return new Auth()
    .auth(req.body.username, req.body.password, req.body.device_id)
    .then((device) => res.send({ device_id: device.id }));
});

app.get("/my-tfc/v1/deliveries", async (req, res) => {
  const prisma = new PrismaClient();
  const devideId = req.headers["device_id"]?.toString();

  if (!devideId) {
    res.sendStatus(422);
  }

  return prisma.device
    .findUniqueOrThrow({
      include: { user: { include: { deliveries: true } } },
      where: { id: devideId },
    })
    .then(({ user }) => fetchAndUpdateDeliveries(user))
    .then(({ latestDeliveries }) => {
      res.send({
        deliveries: latestDeliveries,
        total: latestDeliveries.length,
      });
    });
});

app.post("/my-tfc/v1/push", async (req, res) => {
  const prisma = new PrismaClient();
  const devideId = req.headers["device_id"]?.toString();

  if (!devideId) {
    res.sendStatus(422);
  }

  return prisma.device
    .findUniqueOrThrow({ where: { id: devideId } })
    .then((device) => {
      return prisma.device.update({
        where: { id: device.id },
        data: {
          push_token: req.body.push_token,
        },
      });
    });
});

new Worker(require.resolve(`./worker/DeliveryChecker`), {
  execArgv: ["-r", "ts-node/register"],
});

app.listen(port, () => console.log(`🛰️  Listening on port ${port}`));
