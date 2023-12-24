import { credentials, Server, Metadata } from "@grpc/grpc-js";
import { Device, User } from "@prisma/client";
import "jest";
import { bootService } from "./MyTfcServer";
import prisma from "./db";
import {
  GetDeliveriesFilterType,
  MyTfcClient,
} from "./generated/proto/my_tfc_bb/v1/my_tfc_bb";
import { Status } from "@grpc/grpc-js/build/src/constants";
import { rest } from "msw";
import myTfcEndpoints from "./my-tfc/endpoints";
import { setupServer, SetupServerApi } from "msw/node";
import fs from "fs";
import { TEST_USER } from "./tests/test_data";

export const handlers = [
  rest.get(myTfcEndpoints.authConfig, (_, res, ctx) => {
    const page = fs.readFileSync(
      __dirname + "/tests/fixtures/start-login-page.html",
      "utf8"
    );
    return res(ctx.text(page));
  }),

  rest.post(
    "https://auth.tfc.io/auth/realms/my-tfc/login-actions/authenticate",
    (_, res, ctx) => {
      const page = fs.readFileSync(
        __dirname + "/tests/fixtures/invalid-password.html",
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

async function clearDatabase() {
  console.log("⛑️ deleting data");
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== "_prisma_migrations")
    .map((name) => `"public"."${name}"`)
    .join(", ");

  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
  } catch (error) {
    console.log({ error });
  }
  console.log("🗑️ deleted data");
}

describe("MyTfc gRPC Service", () => {
  let server: Server;
  let client: MyTfcClient;
  let user: User;
  let device: Device;
  let mockTfcApi: SetupServerApi;

  beforeAll(async () => {
    console.log("⛑️ creating data");
    user = await prisma.user.create({
      data: TEST_USER,
    });
    device = await prisma.device.create({
      data: {
        user_id: user.id,
        device_provided_id: "123",
        name: "Burt's iPhone",
      },
    });
    console.log("✨ created data");
  });

  beforeEach(async () => {
    server = bootService();
    client = new MyTfcClient(`0.0.0.0:3000`, credentials.createInsecure());

    mockTfcApi = setupServer(...handlers);
    mockTfcApi.listen();
  });

  afterEach(async () => {
    client.close();
    mockTfcApi.close();
    return new Promise((resolve) => {
      server.tryShutdown(() => resolve(undefined));
    });
  });

  afterAll(async () => {
    await clearDatabase();
    await prisma.$disconnect();
  });

  describe("getDeliveries handler", () => {
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

  describe("authentication", () => {
    describe("when unauthenticated user makes a request", () => {
      it("throws correct error", (done) => {
        const metadata = new Metadata();
        metadata.set("device_id", "does-not-exist-123");
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

    describe("when device_id is not passed", () => {
      it("throws correct error", (done) => {
        client.getDeliveries(
          { filter: GetDeliveriesFilterType.ACTIVE, searchTerm: "" },
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
});
