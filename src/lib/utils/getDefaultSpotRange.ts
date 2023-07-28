import { DateTime } from "luxon";

/**
 * Gets the default range.
 * If the current time is 13 or more, the full day tomorrow is included.
 * If the time is before 13, the last hour is today at midnight.
 *
 * This logic is based on the fact that the spot price api gets updated around 13 to include the next day prices.
 */

export const getDefaultSpotRange = (now?: DateTime) => {
  now = now ?? DateTime.now();
  const { year, month, day, hour } =
    DateTime.now().setZone("Europe/Copenhagen");
  const from = DateTime.fromObject({ year, month, day, hour }).minus({
    hours: 11,
  });

  const lastHourToday = DateTime.fromObject({ year, month, day, hour: 24 });
  const lastExpectedData =
    hour >= 13 ? lastHourToday.plus({ day: 1 }) : lastHourToday;

  const to = lastExpectedData;

  return { from, to };
};
