import type { InternalResponse } from "$lib/types/InternalResponse";
import { returnError } from "$lib/utils/returnError";
import type { SpotBaseParams } from "../types";
import type { SpotResponse } from "./types";

const BASE_API = "https://api.energidataservice.dk/dataset";

type GetSpotDataParams = SpotBaseParams;

/**
 * Function to call the energidataservice api to get spot data for a given day range, and area.
 * @returns {SpotResponse} The api response as json.
 *
 * @example "Get the full month of January danish time": from="2022-01-01" to="2022-02-01".
 */
export const getSpotData = async ({
  from,
  to,
  area,
  customFetch,
}: GetSpotDataParams): Promise<InternalResponse<SpotResponse>> => {
  const start = from.toISODate();
  const end = to.toISODate();

  const fetchClient = customFetch ?? fetch;

  if (!start || !end) {
    return {
      success: false,
      error: { code: 0, message: "No start or end date provided" },
    };
  }

  console.log(
    `💸 🌍`,
    `Calling Energidataservice Elspotprices for data between: ${start} AND ${end}`,
  );

  const baseURl = `${BASE_API}/Elspotprices`;
  const requestParameters = {
    start,
    end,
    filter: JSON.stringify({ PriceArea: area }),
  };
  const queryString = new URLSearchParams(requestParameters);
  const response = await fetchClient(`${baseURl}?${queryString.toString()}`);
  // TODO Look into ZOD for data validation
  const data: SpotResponse = (await response.json()) as SpotResponse;

  if (data?.statusCode && data?.statusCode !== 200) {
    console.log(`💸 🚫`, `Energidataservice Elspotprices call failed`);
    return returnError(
      data.statusCode,
      "Der skete en fejl under kaldet til Energidataservice",
    );
  }

  // It should never be possible to get a response with less that 24 hours of data.
  // If we get less, the data is not useable, and we return and error.
  if (!data.total || data.total < 24) {
    console.log(
      `💸 ⚠️`,
      `Energidataservice Elspotprices returned less data than expected.`,
    );
    return returnError(
      0,
      "Der findes desværre ikke data for den givne periode i energidataservice. Prøv en anden dato.",
    );
  }

  console.log(`💸 ✅`, `Energidataservice Elspotprices returned valid data.`);
  return {
    success: true,
    data,
  };
};
