import { DateTime } from "luxon";
import type { SpotDataRaw, SpotResponse } from "./energidataservice/types";
import type { SpotData } from "./types";

/** Converts a SpotResponse from the API to a SpotData array */
export const spotResponseToSpotData = (input: SpotResponse): SpotData[] => {
  if (!input.records || !input.total) {
    return [];
  }
  const spotData = input.records.map(spotDataRawToSpotData);
  return spotData;
};

/** Converts a raw spot data entry from the API to spot data */
const spotDataRawToSpotData = ({
  HourUTC,
  PriceArea,
  SpotPriceDKK,
}: SpotDataRaw): SpotData => {
  return {
    hourUTC: DateTime.fromISO(HourUTC, { zone: "UTC" }).toJSDate(),
    priceArea: PriceArea,
    priceDKK: SpotPriceDKK,
  };
};
