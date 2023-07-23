import type { InternalResponse } from "$lib/types/InternalResponse";
import { returnError } from "$lib/utils/returnError";
import type { SupabaseBaseParams } from "../types";
import type { HourOfDay, NetCompany } from "./types";
import { convertSupabaseResponseToNettariffsData } from "./convertSupabaseResponseToNettariffsData";

/** Nettariffs interface representing a nettariff structure. */
export interface NettariffsData {
  /** The date from which the datapoint is valid (as an ISO string). */
  fromDate: string;

  /** The price of the nettariff. */
  value: number;

  /** The hour of the day that the value applies to. */
  hourOfDay: HourOfDay;
}

/** Parameters for the getNettariffs function */
export interface GetNettariffsParams extends SupabaseBaseParams {
  /** The key identifying the net company. */
  netCompany: NetCompany;
}

/**
 * Fetches nettariffs from the database and returns them in an InternalResponse object.
 *
 * @param {GetNettariffsParams} params - The parameters for the function.
 * @returns {Promise<InternalResponse<NettariffsData[]>>} - A promise that resolves to an InternalResponse object containing an array of Nettariffs.
 */
export const getNettarrifs = async (
  params: GetNettariffsParams,
): Promise<InternalResponse<NettariffsData[]>> => {
  const { supabaseClient, netCompany } = params;
  const nettariffs = await supabaseClient
    .from("nettarrif")
    .select("from_date, hour_of_day, value")
    .eq("net_company", netCompany);

  const { data, error } = nettariffs;

  if (!data || error) {
    return returnError(
      error?.code ?? 404,
      error?.message ?? "No nettariffs found...",
    );
  }

  const convertedData = convertSupabaseResponseToNettariffsData(data);

  return { success: true, data: convertedData };
};
