import { credentials, Server, Metadata } from "@grpc/grpc-js";
import { Device, User } from "@prisma/client";
import "jest";
import { bootService } from "../MyTfcServer";
import prisma from "../db";
import {
  GetDeliveriesFilterType,
  MyTfcClient,
} from "../generated/proto/my_tfc_bb/v1/my_tfc_bb";
import { Status } from "@grpc/grpc-js/build/src/constants";
import { rest } from "msw";
import myTfcEndpoints from "../my-tfc/endpoints";
import { setupServer, SetupServerApi } from "msw/node";
import fs from "fs";

export const handlers = [
  rest.get(myTfcEndpoints.authConfig, (_, res, ctx) => {
    const page = fs.readFileSync(
      __dirname + "/../tests/fixtures/start-login-page.html",
      "utf8"
    );
    return res(ctx.text(page));
  }),

  rest.post(
    "https://auth.tfc.io/auth/realms/my-tfc/login-actions/authenticate",
    (_, res, ctx) => {
      const page = fs.readFileSync(
        __dirname + "/../tests/fixtures/invalid-password.html",
        "utf8"
      );
      return res(
        ctx.text(page),
        ctx.status(400),
        ctx.cookie("marylands", "are-the-best")
      );
    }
  ),

  rest.get(
    "https://connect.tfc.com/api/v1/packages/my-packages/",
    (_, res, ctx) => {
      return res(ctx.status(403));
    }
  ),
];

describe("getDeliveries handler", () => {
  let server: Server;
  let client: MyTfcClient;
  let user: User;
  let device: Device;
  let mockTfcApi: SetupServerApi;

  beforeEach(async () => {
    console.log("⛑️ creating data");
    user = await prisma.user.create({
      data: {
        username: "test@test.com",
        latest_access_token: "123",
        refresh_token: "123",
        hashed_password:
          "9b1977d2f3c9bb0f00aab556135f75b1:ff7b5a298f2680ae83d97e19b7569453",
      },
    });
    device = await prisma.device.create({
      data: { user_id: user.id, device_provided_id: "123" },
    });
    console.log("✨ created data");

    server = bootService();
    client = new MyTfcClient(`0.0.0.0:3000`, credentials.createInsecure());

    mockTfcApi = setupServer(...handlers);
    mockTfcApi.listen();
  });

  afterEach(async () => {
    if (device) await prisma.device.deleteMany({ where: { id: device.id } });
    if (user) await prisma.user.deleteMany({ where: { id: user.id } });
    await prisma.$disconnect();
    client.close();
    mockTfcApi.close();

    return new Promise((resolve) => {
      server.tryShutdown(() => resolve(undefined));
    });
  });

  describe("when user's authentication details are incorrect", () => {
    it("throws correct error", (done) => {
      const metadata = new Metadata();
      metadata.set("device_id", device.id);
      client.getDeliveries(
        { filter: GetDeliveriesFilterType.ACTIVE, searchTerm: "" },
        metadata,
        (error) => {
          try {
            expect(error).not.toBeNull();
            expect(error?.code).toBe(Status.UNAUTHENTICATED);
          } finally {
            done(undefined);
          }
        }
      );
    });
  });
});
