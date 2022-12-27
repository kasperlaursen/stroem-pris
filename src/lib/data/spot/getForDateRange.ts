import type { InternalResponse } from '$lib/types/InternalResponse';
import { returnError } from '$lib/utils/returnError';
import { LIMIT } from '../supabase/client';
import type { SpotBaseParams, SpotData, SupabaseBaseParams } from './types';
import { getSpotFromDatabase } from './getSpotFromDatabase';
import { energidataservice } from './energidataservice';
import type { SpotDataRaw, SpotResponse } from './energidataservice/types';
import { DateTime } from 'luxon';
import { filterSpotData } from './filterSpotData';
import { saveSpotDataToDatabasse } from './saveSpotDataToDatabasse';

interface Params extends SpotBaseParams, SupabaseBaseParams {}

/**
 * Gets spot data for a given date range.
 * Uses the Supabase cache to get the data if possible.
 * Saves new datapoints to the database after calling the API.
 */
export const getForDateRange = async (params: Params): Promise<InternalResponse<SpotData[]>> => {
	const { from, to, supabaseClient } = params;
	const area = params.area ?? 'DK1';
	const hourDiff = to.diff(from, 'hours').toObject().hours;

	console.log({ hourDiff });

	const dateRangeIsValid = hourDiff && hourDiff > 0;
	if (!dateRangeIsValid) {
		return returnError(400, '🤦‍♂️ The "to" date must be later than the "from" date');
	}

	const dateRangeIsWithinDBLimits = hourDiff < LIMIT;
	if (!dateRangeIsWithinDBLimits) {
		return returnError(400, `😞 Period is too long. Requested: ${hourDiff}. Max: ${LIMIT}.`);
	}

	const dbSpotResponse = await getSpotFromDatabase({
		...params,
		hourDiff
	});

	if (dbSpotResponse.success === false) {
		return dbSpotResponse;
	}

	const dbSpotData = dbSpotResponse.data;

	const gotExpectedData = dbSpotData.length === hourDiff;
	if (gotExpectedData) {
		return dbSpotResponse;
	}

	const apiSpotResponse = await energidataservice.getSpotData({ from, to, area });
	if (apiSpotResponse.success === false) {
		return dbSpotResponse;
	}

	const apiSpotData: SpotData[] = spotResponseToSpotDataArray(apiSpotResponse.data);
	if (apiSpotData.length === 0) {
		return dbSpotResponse;
	}

	const newDataPoints = filterSpotData({ newEntries: apiSpotData, existingEntries: dbSpotData });
	const saveSpotResponse = await saveSpotDataToDatabasse({
		newDataPoints,
		supabaseClient
	});

	if (saveSpotResponse.success === false) {
		console.log('🚫', 'Spot Data Save Failed!');
	}

	return { success: true, data: [...newDataPoints, ...dbSpotData] };
};

/** Converts a SpotResponse from the API to a SpotData array */
const spotResponseToSpotDataArray = (input: SpotResponse): SpotData[] => {
	if (!input.records || !input.total) {
		return [];
	}
	const spotData = input.records.map(spotDataRawToSpotData);
	return spotData;
};

/** Converts a raw spot data entry from the API to spot data */
const spotDataRawToSpotData = ({ HourUTC, PriceArea, SpotPriceDKK }: SpotDataRaw): SpotData => {
	return {
		hourUTC: DateTime.fromISO(HourUTC).toJSDate(),
		priceArea: PriceArea,
		priceDKK: SpotPriceDKK
	};
};
