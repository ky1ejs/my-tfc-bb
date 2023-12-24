import { Delivery } from "@prisma/client";
import { Delivery as DeliveryProto } from "../generated/proto/my_tfc_bb/v1/model";
import { identifyCourier } from "./identifyCourier";

export function deliveryToProto(d: Delivery): DeliveryProto {
  return {
    id: d.id,
    name: d.name,
    dateReceived: d.date_received,
    collectedAt: d.collected_at ?? undefined,
    identifiedCourier: identifyCourier(d.name),
  };
}
