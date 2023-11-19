import { TEST_USER } from "../tests/test_data";
import { fetchAndUpdateDeliveries } from "./get_deliveries";
import prisma from "../db";
import { User } from "@prisma/client";
import { setupServer, SetupServerApi } from "msw/node";
import { rest } from "msw";
import fs from "fs";
import myTfcEndpoints from "./endpoints";
import { pushToUsersDevices } from "../services/NotificationSender";

jest.mock("../services/NotificationSender", () => {
  return {
    pushToUsersDevices: jest.fn((user, push) => {
      console.log("user: ", user);
      console.log("push: ", push);
      return Promise.resolve();
    }),
  };
});

const handlers = [
  rest.get(myTfcEndpoints.delivereies, (_, res, ctx) => {
    const body = fs.readFileSync(
      __dirname + "/../tests/fixtures/deliveries.json",
      "utf8"
    );
    return res(ctx.status(200), ctx.text(body));
  }),
];

describe("fetchAndUpdateDeliveries", () => {
  let user: User;
  let mockTfcApi: SetupServerApi;

  beforeEach(async () => {
    user = await prisma.user.create({
      data: TEST_USER,
    });

    mockTfcApi = setupServer(...handlers);
    mockTfcApi.listen();
  });

  afterEach(async () => {
    if (user) await prisma.user.deleteMany({ where: { id: user.id } });
    await prisma.delivery.findMany().then((deliveries) => {
      prisma.delivery.deleteMany({
        where: { id: { in: deliveries.map((d) => d.id) } },
      });
    });

    await prisma.$disconnect();
    mockTfcApi.close();
  });

  it("should only send one notification for new deliveries", async () => {
    const result = await fetchAndUpdateDeliveries(user);
    expect(result.newDeliveries.length).toBe(1);
    expect(pushToUsersDevices).toHaveBeenCalledTimes(1);
  });
});
