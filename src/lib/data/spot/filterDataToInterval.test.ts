import { DateTime } from "luxon";
import { describe, it, expect } from "vitest";
import { filterDataToInterval } from "./filterDataToInterval";

describe("filterDataToInterval", () => {
  it("should return points within range", () => {
    const from = DateTime.fromISO("2022-01-01T01:00:00.000Z");
    const to = DateTime.fromISO("2022-01-01T03:00:00.000Z");
    const result = filterDataToInterval({
      from,
      to,
      data: [
        {
          hourUTC: DateTime.fromISO("2022-01-01T00:00:00.000Z").toJSDate(),
        },
        {
          hourUTC: DateTime.fromISO("2022-01-01T01:00:00.000Z").toJSDate(),
        },
        {
          hourUTC: DateTime.fromISO("2022-01-01T02:00:00.000Z").toJSDate(),
        },
        {
          hourUTC: DateTime.fromISO("2022-01-01T03:00:00.000Z").toJSDate(),
        },
      ],
    });
    expect(result).toEqual([
      {
        hourUTC: DateTime.fromISO("2022-01-01T01:00:00.000Z").toJSDate(),
      },
      {
        hourUTC: DateTime.fromISO("2022-01-01T02:00:00.000Z").toJSDate(),
      },
    ]);
  });
});
