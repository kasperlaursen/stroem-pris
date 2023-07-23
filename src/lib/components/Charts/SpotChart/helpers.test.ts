// functions.test.ts
import { DateTime } from "luxon";
import { describe, it, expect } from "vitest";
import {
  getColor,
  getWidth,
  getTimeLabel,
  getPriceLabel,
  getState,
} from "./helpers";

describe("getColor", () => {
  it("returns the correct color based on the given parameters", () => {
    const params = [
      { current: 10, average: 10 },
      { current: 12, average: 10 },
      { current: 8, average: 10 },
      { current: 11, average: 10, multiplyer: 0.1 },
    ];

    const expected = ["yellow", "red", "green", "red"];

    expect(getColor(params[0])).toEqual(expected[0]);
    expect(getColor(params[1])).toEqual(expected[1]);
    expect(getColor(params[2])).toEqual(expected[2]);
    expect(getColor(params[3])).toEqual(expected[3]);
  });
});

describe("getWidth", () => {
  it("returns the correct width based on the given parameters", () => {
    const params = [
      { current: 50, max: 100 },
      { current: 25, max: 100 },
    ];

    const expected = [0.5, 0.25];

    params.forEach((param, index) => {
      const width = getWidth(param);
      expect(width).toEqual(expected[index]);
    });
  });
});

describe("getTimeLabel", () => {
  it("returns the correct time label", () => {
    const time = DateTime.fromISO("2023-04-21T14:30:00");
    const expected = "kl. 14";
    const label = getTimeLabel({ time });
    expect(label).toEqual(expected);
  });
});

describe("getPriceLabel", () => {
  it("returns the correct price label", () => {
    const params = [1234.5678, 12.345678];
    const expected = ["1.234,57", "12,35"];

    params.forEach((price, index) => {
      const label = getPriceLabel({ price });
      expect(label).toEqual(expected[index]);
    });
  });
});

describe("getState", () => {
  it("returns the correct state based on the given time parameters", () => {
    const now = DateTime.local();
    const time1 = now.minus({ hours: 1 });
    const time2 = now.plus({ hours: 1 });
    const time3 = now;

    const expected1 = "inactive";
    const expected2 = "none";
    const expected3 = "active";

    const state1 = getState({ time: time1, now });
    const state2 = getState({ time: time2, now });
    const state3 = getState({ time: time3, now });

    expect(state1).toEqual(expected1);
    expect(state2).toEqual(expected2);
    expect(state3).toEqual(expected3);
  });
});
