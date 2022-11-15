import { getData, getToken } from '$lib/eloverblik/api';
import { convertResponseToMeterTableData } from '$lib/eloverblik/utils';
import { LIMIT } from '$lib/supabaseClient';
import { validateStringsAsISODateRange } from '$lib/utils/dateValidaton';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { DateTime } from 'luxon';

export const GET: RequestHandler = async (event) => {
	console.log('📊 🆕', `Meter api request`);
	const { url } = event;

	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		console.log('📊 ✋', `Requester is not signed in`);
		throw error(403, `🔐 The user is not signed in`);
	}

	// Get data parameters
	const fromDateParam = url.searchParams.get('from');
	const toDateParam = url.searchParams.get('to');

	const dateValidaton = validateStringsAsISODateRange(fromDateParam, toDateParam, 'TODAY');
	if (!dateValidaton.isValid) {
		throw error(dateValidaton.errorCode, dateValidaton.errorMessage);
	}
	const { fromDate, toDate, hourDiff } = dateValidaton;

	console.log('📊 🆕', `Meter api request from ${fromDate.toISODate()} to ${toDate.toISODate()}`);

	// Check for LIMIT reached...
	if (hourDiff > LIMIT) {
		throw error(
			400,
			`😞 Period is too long, requested ${hourDiff} data point, but no more than ${LIMIT} is allowed`
		);
	}

	// Get all tokens from db
	const { data: dbTokens } = await supabaseClient
		.from('datahub_tokens')
		.select('data_token, refresh_token, data_token_expire_utc, usage_meter_id');

	if (!dbTokens || dbTokens.length === 0 || !dbTokens[0].usage_meter_id) {
		throw error(400, '🤷‍♂️ User has no usage_meter_id saved');
	}

	const meterId = dbTokens[0].usage_meter_id;

	// Call supabase to check if data is available for the date range
	const { data: dbMeterData } = await supabaseClient
		.from('meter_data')
		.select('measurement, meter_id, hour_utc')
		.eq('meter_id', meterId)
		.gte('hour_utc', fromDate.toUTC())
		.lt('hour_utc', toDate.toUTC());
	console.log('📊 🗄 ', `Got ${dbMeterData?.length} data point from Database, expected ${hourDiff}`);

	// Check if correct ammount of data is available
	if (dbMeterData && dbMeterData?.length > hourDiff) {
		throw error(500, '😱 Found more data point than expected');
	}

	// If we get expected ammount of data, return it!
	if (dbMeterData && dbMeterData.length === hourDiff) {
		console.log('📊 🗄 ', `Returning ${dbMeterData?.length} data point from Database`);
		return json({ success: true, data: dbMeterData });
	}

	if (!dbTokens || dbTokens.length === 0) {
		throw error(400, '🔐 User has no datahub_tokens saved');
	}

	if (dbTokens.length < 1) {
		throw error(500, '😱 Found more token entries that expected');
	}

	const { refresh_token, data_token, data_token_expire_utc } = dbTokens[0];
	let validDataToken: string = data_token;
	// Check for Data_Token for user
	if (!data_token || DateTime.fromISO(data_token_expire_utc).diffNow('minutes').minutes < 10) {
		console.log('📊 🗄 ', `Data_token needs to be refreshed.`);

		// Check for Refresh_Token for user
		if (!refresh_token) {
			throw error(400, '🔐 User has no refresh_token saved');
		}

		// Get new token
		const tokenResponse = await getToken(refresh_token);
		if (!tokenResponse.success) {
			throw error(500, tokenResponse.error.message);
		}

		validDataToken = tokenResponse.data.token;

		// Save Token to DB
		const { error: setTokenError } = await supabaseClient
			.from('datahub_tokens')
			.update({
				data_token: validDataToken,
				data_token_expire_utc: DateTime.now().plus({ hours: 24 }).toISO()
			})
			.eq('user_id', session.user.id);
		console.log('📊 🗄 ', `Saving token`, setTokenError?.message);
	}

	//Get data form API
	const meterResponse = await getData(validDataToken, fromDate.toISODate(), toDate.toISODate(), [
		meterId
	]);

	if (!meterResponse.success) {
		throw error(500, meterResponse.error.message);
	}

	// Convert data to correct format
	const meterData = convertResponseToMeterTableData(meterResponse.data);
	console.log('📊 🌍', `Got ${meterData.length} data point from api.`);

	// Filter datapoints for existing before save to DB
	const filteredMeterData = !dbMeterData
		? meterData
		: meterData.filter(
				({ hour_utc, meter_id }) =>
					!dbMeterData.some(
						(db) =>
							DateTime.fromISO(db.hour_utc, { zone: 'utc' }).toMillis() ===
								DateTime.fromISO(hour_utc, { zone: 'utc' }).toMillis() && db.meter_id === meter_id
					)
		  );

	// Save data to DB
	console.log('📊 🗄 ', `Saving ${filteredMeterData.length} data point from api to database`);
	const { data: insertedData, error: dbError } = await supabaseClient
		.from('meter_data')
		.insert(
			filteredMeterData.map((meterDataPoint) => ({
				user_id: session.user.id,
				...meterDataPoint
			}))
		)
		.select('measurement, meter_id, hour_utc');

	if (dbError) {
		console.log('📊 🚫 ', `Database save failed`, dbError);
	}

	const mergedData = [...(insertedData ?? []), ...(dbMeterData ?? [])];
	console.log('📊 ✅', `Returning ${mergedData?.length} data points.`);
	return json({ success: true, data: mergedData });
};
