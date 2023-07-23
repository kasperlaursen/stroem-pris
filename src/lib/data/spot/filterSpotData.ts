import { DateTime } from "luxon";
import type { SpotData } from "./types";

interface Params {
  existingEntries: SpotData[];
  newEntries: SpotData[];
}
/**
 * Takes two lists of SpotData and returns a list with the difference.
 * Used to filter out existing datapoints before saving them to the database.
 */
export const filterSpotData = ({ existingEntries, newEntries }: Params) => {
  const filteredData = newEntries.filter(
    (newEntry) =>
      !existingEntries?.some(
        (existingEntry) =>
          DateTime.fromJSDate(existingEntry.hourUTC).toSeconds() ===
            DateTime.fromJSDate(newEntry.hourUTC).toSeconds() &&
          existingEntry.priceArea === newEntry.priceArea,
      ),
  );
  return filteredData;
};
