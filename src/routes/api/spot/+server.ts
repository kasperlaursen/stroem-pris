import { getSpotDataFromDataService } from '$lib/energidataservice/api';
import type { PriceAreas } from '$lib/energidataservice/types';
import { LIMIT } from '$lib/supabaseClient';
import { validateStringsAsISODateRange } from '$lib/utils/dateValidaton';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, json } from '@sveltejs/kit';
import { DateTime } from 'luxon';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	console.log('💸 🆕', `Spot api request`);
	const { url } = event;

	// Get data parameters
	const fromDateParam = url.searchParams.get('from');
	const toDateParam = url.searchParams.get('to');

	const priceArea: PriceAreas = url.searchParams.get('area') === 'DK2' ? 'DK2' : 'DK1';

	const dateValidaton = validateStringsAsISODateRange(fromDateParam, toDateParam, 'TOMORROW');
	if (!dateValidaton.isValid) {
		throw error(dateValidaton.errorCode, dateValidaton.errorMessage);
	}
	const { fromDate, toDate, hourDiff } = dateValidaton;

	// Return error of DB limit is exceeded
	if (hourDiff > LIMIT) {
		throw error(
			400,
			`😞 Period is too long, requested ${hourDiff} data point, but no more than ${LIMIT} is allowed`
		);
	}

	console.log(
		'💸 🗓️ ',
		`Requested data between ${fromDateParam} and ${toDate.toISODate()}, for area ${priceArea}`
	);
	// Call supabase to check if data is available for the date range
	const { supabaseClient } = await getSupabase(event);
	const { data: tableData } = await supabaseClient
		.from('spot')
		.select('price_dkk, price_area, hour_utc')
		.eq('price_area', priceArea)
		.gte('hour_utc', fromDate.toUTC())
		.lt('hour_utc', toDate.toUTC());
	console.log('💸 🗄 ', `Got ${tableData?.length} data point from Database, expected ${hourDiff}`);

	if (tableData && tableData?.length > hourDiff) {
		throw error(500, '😱 Found more data point than expected');
	}

	// If we miss data points
	if (!tableData || tableData.length < hourDiff) {
		const safeTableData = tableData ?? [];

		// Get data from external API
		const apiData = await getSpotDataFromDataService(fromDate, toDate, priceArea);

		if (apiData.success === false) {
			if (apiData.error.code === 0) {
				const { data: backupData } = await supabaseClient
					.from('spot_manual')
					.select('price_dkk, price_area, hour_utc')
					.eq('price_area', priceArea)
					.gte('hour_utc', fromDate.toUTC())
					.lt('hour_utc', toDate.toUTC());

				if (backupData && backupData.length === hourDiff) {
					console.log('💸 ✅', `Returning ${backupData.length} data point from BACKUP database`);
					return json({
						success: true,
						data: backupData,
						message:
							'OBS! Data for den valgte dato er ikke tilgængelig fra Energinet. Alternative kilder bruges og præcision kan variere.'
					});
				}
			}

			console.log('💸 🌍', apiData.error.message);
			// If the api call returned an error, surface it to the users.
			return json(apiData);
		}

		const records = apiData.data.records;
		if (!records || !records.length) {
			throw error(500, `Got 0 records from API.`);
		}

		console.log('💸 🌍', `Got ${records.length} data point from api, expected ${hourDiff}`);

		// Filter Data to only insert missing rows (constraint on hour_utc && price_area)
		const filteredData = records.filter(
			({ HourUTC, PriceArea }) =>
				!safeTableData?.some(
					({ hour_utc, price_area }) =>
						dateAsEpoc(HourUTC) === dateAsEpoc(hour_utc) && PriceArea === price_area
				)
		);

		// Save data to Database
		console.log('💸 ⏳', `Saving ${filteredData.length} data point from api to database`);
		const { data: insertedData, error: dbError } = await supabaseClient
			.from('spot')
			.insert(
				filteredData?.map(({ SpotPriceDKK, PriceArea, HourUTC }) => ({
					price_dkk: SpotPriceDKK,
					price_area: PriceArea,
					hour_utc: HourUTC
				}))
			)
			.select('price_dkk, price_area, hour_utc');

		if (dbError) {
			throw error(500, `😢 DB insert failed with: ${JSON.stringify(dbError)}`);
		}
		// Return data
		console.log(
			'💸 ✅',
			`Returning ${[...safeTableData, ...insertedData].length} data point from api and database`
		);
		return json({ success: true, data: [...safeTableData, ...insertedData] });
	}

	// Data already in DB, lets return it
	console.log('💸 ✅', `Returning ${tableData?.length} data point from database`);
	return json({ success: true, data: tableData });
};

/**
 * Convert ISO date string to Epoc.
 *
 *  _**!!:** The string must be utc timezone._
 * @param date An ISO date string to get as Epoc
 * @returns {number} Date as Epoc number
 */
const dateAsEpoc = (date: string): number => DateTime.fromISO(date, { zone: 'utc' }).toSeconds();
