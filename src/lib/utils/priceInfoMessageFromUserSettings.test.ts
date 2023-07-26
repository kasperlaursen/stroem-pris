import { describe, it, expect } from "vitest";
import { priceInfoMessageFromUserSettings } from "./priceInfoMessageFromUserSettings";

describe("priceInfoMessageFromUserSettings", () => {
  it("Returns correct string for current by default", () => {
    const result = priceInfoMessageFromUserSettings({});
    expect(result).toEqual(
      "Viser Spot pris eksklusiv Gebyrer, Tariffer, Elafgift og Moms",
    );
  });
});
