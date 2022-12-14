import type { Session } from '@supabase/supabase-js';
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import { getMeterDataFromDatabase } from '$lib/datasources/meter/getMeterDataFromDatabase';
import { getMeterDataFromExternalSource } from '$lib/datasources/meter/getMeterDataFromExternalSource';
import { getTokensFromDatabase } from '$lib/datasources/meter/getTokensFromDatabase';
import { saveMeterDataToDatabase } from '$lib/datasources/meter/saveMeterDatatoDatabase';
import { removeExistingMeterData } from '$lib/datasources/meter/removeExistingMeterData';
import { handleInvalidDates, handleLimitExceeded } from '$lib/datasources/meter/errorHandlers';
import { type MeterTableData, convertResponseToMeterTableData } from '$lib/eloverblik/utils';
import { LIMIT } from '$lib/supabaseClient';
import type { InternalApiResponse } from '$lib/types/api';
import { validateStringsAsISODateRange } from '$lib/utils/dateValidaton';

interface Params {
	fromDateString: string | null;
	toDateString: string | null;
	supabaseClient: TypedSupabaseClient;
	session: Session;
}

export const getMeterDataForPeriod = async ({
	fromDateString,
	toDateString,
	supabaseClient,
	session
}: Params): Promise<InternalApiResponse<MeterTableData[]>> => {
	const dateValidaton = validateStringsAsISODateRange(fromDateString, toDateString, 'TODAY');
	if (dateValidaton.isValid === false) {
		return handleInvalidDates(dateValidaton, fromDateString, toDateString);
	}

	let { fromDate, toDate, hourDiff } = dateValidaton;

	const requestExceedsDatabaseLimit = hourDiff > LIMIT;
	if (requestExceedsDatabaseLimit) {
		return handleLimitExceeded(hourDiff, LIMIT);
	}

	const savedDatahubData = await getTokensFromDatabase({ supabaseClient });
	if (savedDatahubData.success === false) {
		return savedDatahubData;
	}

	const {
		usage_meter_id: usageMeterId,
		data_token: dataToken,
		data_token_expire_utc: dataTokenExpireUTC,
		refresh_token: refreshToken
	} = savedDatahubData.data;

	const savedMeterDataResponse = await getMeterDataFromDatabase({
		meterId: usageMeterId,
		fromDate,
		toDate,
		expecedDatapoints: hourDiff,
		supabaseClient
	});

	if (savedMeterDataResponse.success === false) {
		return savedMeterDataResponse;
	}

	const { data: savedMeterData } = savedMeterDataResponse;

	const expectedDataExistsInDatabase = savedMeterData && savedMeterData.length === hourDiff;
	if (expectedDataExistsInDatabase) {
		return { success: true, data: savedMeterData };
	}

	const meterDataResponse = await getMeterDataFromExternalSource({
		dataToken,
		usageMeterId,
		dataTokenExpireUTC,
		refreshToken,
		session,
		supabaseClient,
		fromDate,
		toDate
	});

	if (meterDataResponse.success === false) {
		return meterDataResponse;
	}

	const { data: meterDataFromAPI } = meterDataResponse;

	const meterData = convertResponseToMeterTableData(meterDataFromAPI);
	const newMeterData = removeExistingMeterData({
		newMeterData: meterData,
		oldMeterData: savedMeterData
	});

	const newMeterDatabaseResponse = await saveMeterDataToDatabase({
		newMeterData,
		supabaseClient,
		session
	});

	if (newMeterDatabaseResponse.success === false) {
		return newMeterDatabaseResponse;
	}

	const { data: newDatapoints } = newMeterDatabaseResponse;

	const allAvailableDataPoints = [...(newDatapoints ?? []), ...(savedMeterData ?? [])];

	return { success: true, data: allAvailableDataPoints };
};
