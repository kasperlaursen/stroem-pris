import type { DateTime } from "luxon";
import type { PriceAreas, SpotResponse } from "./types";

export const getSpotDataFromDataService = async (from: DateTime, to: DateTime, area: PriceAreas) => {
    const start = from.toFormat("yyyy-MM-dd");
    const end = to.toFormat("yyyy-MM-dd");
    console.log(`🌍 Calling API for data between: ${start} AND ${end}`);

    const APIBase = "https://api.energidataservice.dk/v2/dataset/Elspotprices";
    const request = await fetch(`${APIBase}?start=${start}&end=${end}&filter={"PriceArea":"${area}"}`)
    const data: SpotResponse = await request.json();
    return data;
}

