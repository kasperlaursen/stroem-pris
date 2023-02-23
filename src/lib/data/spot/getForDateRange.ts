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
import { convertDatesToFullDays } from '$lib/utils/convertDatesToFullDays';
import { filterDataToInterval } from './filterDataToInterval';
import { spotResponseToSpotData } from './spotResponseToSpotData';

export interface Params extends SpotBaseParams, SupabaseBaseParams {}

/**
 * Gets spot data for a given date range.
 * Uses the Supabase cache to get the data if possible.
 * Saves new datapoints to the database after calling the API
 */
export const getForDateRange = async (params: Params): Promise<InternalResponse<SpotData[]>> => {
	const { area, from, to, customFetch, supabaseClient } = params;
	const hourDiff = to.diff(from, 'hours').toObject().hours;

	const dateRangeIsValid = hourDiff && hourDiff > 0;
	if (!dateRangeIsValid) {
		return returnError(400, '🤦‍♂️ The "to" date must be later than the "from" date');
	}

	const {
		fullDayFrom: dataFrom,
		fullDayFromUTC: dateFromUTC,
		fullDayTo: dataTo,
		fullDayToUTC: dateToUTC,
		fullHourDiff: dataHourDiff
	} = convertDatesToFullDays({ to, from });

	const dateRangeIsWithinDBLimits = dataHourDiff && dataHourDiff < LIMIT;
	if (!dateRangeIsWithinDBLimits) {
		return returnError(400, `😞 Period is too long. Requested: ${dataHourDiff}. Max: ${LIMIT}.`);
	}

	const dbSpotResponse = await getSpotFromDatabase({
		...params,
		to: dateToUTC,
		from: dateFromUTC,
		hourDiff: dataHourDiff
	});

	if (dbSpotResponse.success === false) {
		return dbSpotResponse;
	}

	const dbSpotData = dbSpotResponse.data;
	const gotExpectedData = dbSpotData.length === dataHourDiff;
	if (gotExpectedData) {
		const requestedDatapoints = filterDataToInterval({ from, to, data: dbSpotResponse.data });
		return { success: true, data: requestedDatapoints };
	}

	const apiSpotResponse = await energidataservice.getSpotData({
		from: dataFrom,
		to: dataTo,
		area,
		customFetch
	});
	if (apiSpotResponse.success === false) {
		return dbSpotResponse;
	}

	const apiSpotData: SpotData[] = spotResponseToSpotData(apiSpotResponse.data);
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
		console.log('🚫', `[${saveSpotResponse.error.code}] ${saveSpotResponse.error.message}`);
	}

	const allDatapoints = [...newDataPoints, ...dbSpotData];
	const requestedDatapoints = filterDataToInterval({ from, to, data: allDatapoints });

	return { success: true, data: requestedDatapoints };
};
