import { DateTime } from "luxon";
import { describe, it, expect } from "vitest";
import { getLabelFromTime } from "./getLabelFromTime";

describe("getLabelFromTime", () => {
  it("Returns correct string for current day and hour", () => {
    const hour = DateTime.now();
    const result = getLabelFromTime({
      hour,
      append: "pris",
    });
    expect(result).toEqual("Nuværende pris");
  });

  it("Returns correct string for another hour same day", () => {
    const anotherHourToday = DateTime.now().hour === 1 ? 2 : 1;
    const hour = DateTime.now().set({ hour: anotherHourToday });
    const result = getLabelFromTime({
      hour,
      append: "pris",
    });
    expect(result).toEqual(`pris kl ${anotherHourToday} i dag`);
  });

  it("Returns correct string for another day", () => {
    const hour = DateTime.now().plus({ days: 1 }).set({ hour: 14 });
    const result = getLabelFromTime({
      hour,
      append: "pris",
    });
    expect(result).toEqual("pris kl 14 i morgen");
  });
});
