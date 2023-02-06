import { Courier } from "../generated/proto/my_tfc_bb/v1/my_tfc_bb";

export function identifyCourier(deliveryName: string): Courier {
  const text = deliveryName.toLowerCase();
  const searchTerms = new Map<Courier, string[]>([
    [Courier.AMAZON, ["amazon", "laser ship"]],
    [Courier.FEDEX, ["fedex"]],
    [Courier.UPS, ["ups"]],
    [Courier.USPS, ["usps"]],
  ]);

  const identifiedCourier = Array.from(searchTerms.keys()).find((c) =>
    searchTerms.get(c)?.find((t) => {
      if (text.includes(t)) return c;
    })
  );

  return identifiedCourier ?? Courier.UNIDENTIFIED;
}

export function formattedCourierName(courier: Courier): string {
  switch (courier) {
    case Courier.AMAZON:
      return "Amazon";
    case Courier.FEDEX:
      return "Fedex";
    case Courier.UPS:
      return "UPS";
    case Courier.USPS:
      return "USPS";
    case (Courier.UNIDENTIFIED, Courier.UNRECOGNIZED):
    default:
      return "unkown courier";
  }
}
