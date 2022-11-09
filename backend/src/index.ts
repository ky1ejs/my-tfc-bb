import express from "express";
import cors from "cors";
import Auth from "./services/auth";
import { Worker } from "worker_threads";
import { fetchAndUpdateDeliveries } from "./my-tfc/get_deliveries";
import prisma from "./db";
import { PushPlatform, TokenEnv } from "@prisma/client";
import { pushToDevice } from "./worker/NotificationSender";

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
    .authDevice(req.body.username, req.body.password, req.body.device_id)
    .then((device) => res.send({ device_id: device.id }));
});

app.get("/my-tfc/v1/deliveries", async (req, res) => {
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
  const devideId = req.headers["device_id"]?.toString();
  const platform: PushPlatform = req.body.platform
  const token: string = req.body.push_token
  const env: TokenEnv = req.body.token_env

  if (!devideId) {
    res.sendStatus(422);
  }

  return prisma.device
    .findUniqueOrThrow({ where: { id: devideId } })
    .then((device) => {
      return prisma.pushToken.upsert({
        where: { device_id: device.id },
        create: {
          token: token,
          platform: platform,
          env: env,
          device: {
            connect: {
              id: device.id
            }
          }
        },
        update: {
          token: token
        },
      });
    });
});

app.get("/my-tfc/v1/push/test", async (req, res) => {
  const devideId = req.headers["device_id"]?.toString();

  if (!devideId) {
    res.sendStatus(422);
  }

  return prisma.device
    .findUniqueOrThrow({ where: { id: devideId }, include: {push_token: true} })
    .then((device) => {
      if (!device.push_token!) {
        res.sendStatus(422)
        return Promise.resolve()
      }
      return pushToDevice(device.push_token, "Testing 123.")
        .then(v => res.sendStatus(200))
    });
});

new Worker(require.resolve(`./worker/DeliveryChecker`), {
  execArgv: ["-r", "ts-node/register"],
});

app.listen(port, () => console.log(`🛰️  Listening on port ${port}`));
