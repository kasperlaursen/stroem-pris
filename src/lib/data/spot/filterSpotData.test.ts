import { describe, it, expect } from "vitest";
import { filterSpotData } from "./filterSpotData";
import type { SpotData } from "./types";

const mockEntries: { [key: string]: SpotData } = {
  DK1_1: {
    hourUTC: new Date("2022-01-01T00:00:00.000Z"),
    priceArea: "DK1",
    priceDKK: 0,
  },
  DK1_2: {
    hourUTC: new Date("2022-01-02T00:00:00.000Z"),
    priceArea: "DK1",
    priceDKK: 0,
  },
  DK1_3: {
    hourUTC: new Date("2022-01-03T00:00:00.000Z"),
    priceArea: "DK1",
    priceDKK: 0,
  },
  DK2_1: {
    hourUTC: new Date("2022-01-01T00:00:00.000Z"),
    priceArea: "DK2",
    priceDKK: 0,
  },
  DK2_2: {
    hourUTC: new Date("2022-01-02T00:00:00.000Z"),
    priceArea: "DK2",
    priceDKK: 0,
  },
};

describe("filterSpotData", () => {
  it("should return an empty array if all new entries already exist in existing entries", () => {
    const existingEntries: SpotData[] = Object.values(mockEntries);
    const newEntries: SpotData[] = Object.values(mockEntries);

    const result = filterSpotData({ existingEntries, newEntries });
    expect(result).toEqual([]);
  });

  it("should return an array with new entries that do not already exist in existing entries", () => {
    const existingEntries: SpotData[] = [mockEntries.DK1_1, mockEntries.DK1_2];
    const newEntries: SpotData[] = [
      mockEntries.DK1_1,
      mockEntries.DK1_2,
      mockEntries.DK1_3,
    ];

    const result = filterSpotData({ existingEntries, newEntries });
    expect(result).toEqual([mockEntries.DK1_3]);
  });
  it("does not filter out new entries that have different times or price areas", () => {
    const existingEntries: SpotData[] = [mockEntries.DK1_1, mockEntries.DK1_2];
    const newEntries: SpotData[] = [
      mockEntries.DK1_3,
      mockEntries.DK2_1,
      mockEntries.DK2_2,
    ];

    const result = filterSpotData({ existingEntries, newEntries });
    expect(result).toEqual(newEntries);
  });
});
