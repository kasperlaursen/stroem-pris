import { spot } from "$lib/data/spot";
import type { PriceAreas } from "$lib/data/spot/energidataservice/types";
import type { SpotData } from "$lib/data/spot/types";
import type { InternalError } from "$lib/types/InternalResponse";
import { DateTime } from "luxon";
import type { PageServerLoad } from "./$types";
import { getFees, type FeesData } from "$lib/data/fees/getFees";
import {
  getNettarrifs,
  type NettariffsData,
} from "$lib/data/fees/getNettarrifs";
import { netCompaniesArray, type NetCompany } from "$lib/data/fees/types";
import { getDefaultSpotRange } from "$lib/utils/getDefaultSpotRange";

interface PageData {
  /** Spot data for the given range */
  spotData?: SpotData[];
  /** Spot average for the last 30 days */
  spotAverage?: number;
  /** Max spot value of the returned spotData */
  spotMax?: number;
  /** Fees data used to calculate full price */
  feesData?: FeesData[];
  /** The tarriffs for the selected net company */
  netTarifData?: NettariffsData[];
}

interface PageResponse {
  data: PageData;
  errors?: InternalError[];
  area: PriceAreas;
  netcompanyParam?: NetCompany | string | null;
}

export const load: PageServerLoad = async ({
  url,
  fetch,
  locals: { supabase },
}): Promise<PageResponse> => {
  const { from: defualtFrom, to: defaultTo } = getDefaultSpotRange();
  const dateParam = url.searchParams.get("date");
  const netcompanyParam = url.searchParams.get("netcompany");

  const area = url.searchParams.get("area") === "DK2" ? "DK2" : "DK1";
  const from = dateParam
    ? DateTime.fromISO(dateParam, { zone: "Europe/Copenhagen" })
    : defualtFrom;
  const to = dateParam
    ? DateTime.fromISO(dateParam, { zone: "Europe/Copenhagen" }).plus({
        days: 1,
      })
    : defaultTo;

  const errors: InternalError[] = [];
  const data: PageData = {};

  const spotDataRequest = spot.getForDateRange({
    from,
    to,
    area,
    supabaseClient: supabase,
    customFetch: fetch,
  });
  const spotAverageRequest = spot.getAverage({
    days: 30,
    area,
    supabaseClient: supabase,
  });

  const feesDataRequest = getFees({ supabaseClient: supabase });

  const promiseArray = [
    spotDataRequest,
    spotAverageRequest,
    feesDataRequest,
  ] as const;

  // TODO Propper NetCompany Validation and error handling
  if (
    netcompanyParam &&
    netCompaniesArray.includes(netcompanyParam as NetCompany)
  ) {
    const netTarifDataRequest = getNettarrifs({
      supabaseClient: supabase,
      netCompany: netcompanyParam as NetCompany,
    });
    const netTarifData = await netTarifDataRequest;

    if (netTarifData.success === false) {
      errors.push(netTarifData.error);
    } else {
      data.netTarifData = netTarifData.data;
    }
  }

  const [spotData, spotAverage, feesData] = await Promise.all(promiseArray);

  if (spotData.success === false) {
    errors.push(spotData.error);
  } else {
    data.spotData = spotData.data;
    data.spotMax = Math.max(...spotData.data.map(({ priceDKK }) => priceDKK));
  }

  if (spotAverage.success === false) {
    errors.push(spotAverage.error);
  } else {
    data.spotAverage = spotAverage.data;
  }

  if (feesData.success === false) {
    errors.push(feesData.error);
  } else {
    data.feesData = feesData.data;
  }

  return {
    errors,
    data,
    area,
    netcompanyParam,
  };
};
