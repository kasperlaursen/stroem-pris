import { getSpotDataFromDataService } from '$lib/energidataservice/api';
import type { PriceAreas } from '$lib/energidataservice/types';
import { LIMIT } from '$lib/supabaseClient';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, json } from '@sveltejs/kit';
import { DateTime } from 'luxon';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	console.log("💸", `Spot api request`);
	const { url } = event;

	// Get data parameters
	const fromDateParam = url.searchParams.get('from');
	const toDateParam = url.searchParams.get('to');
	const priceArea: PriceAreas = url.searchParams.get('area') === "DK2" ? "DK2" : "DK1";

	// Validate required parameters exist
	if (!fromDateParam || !toDateParam) {
		throw error(400, 'Missing required parameters');
	}

	// Split date param to array
	const fromDateSplit = fromDateParam.split("-");
	const toDateSplit = toDateParam.split("-");

	// Verify date parameters has correct length
	if (fromDateSplit.length !== 3 || toDateSplit.length !== 3) {
		throw error(400, 'Invalid date: Must be valid date of the format "yyyy-mm-dd"');
	}

	// Convert date parameters to datetime
	const fromDate = DateTime.fromObject({
		year: Number(fromDateSplit[0]),
		month: Number(fromDateSplit[1]),
		day: Number(fromDateSplit[2])
	}, { zone: 'Europe/Copenhagen' });

	const toDate = DateTime.fromObject({
		year: Number(toDateSplit[0]),
		month: Number(toDateSplit[1]),
		day: Number(toDateSplit[2])
	}, { zone: 'Europe/Copenhagen' });


	// Validate dates are valid
	if (!fromDate.isValid) {
		throw error(400, '🤨 Invalid from date: Must be valid date of the format "yyyy-mm-dd"');
	}
	if (!toDate.isValid) {
		throw error(400, '🤨 Invalid to date: Must be valid date of the format "yyyy-mm-dd"');
	}

	// Get hours between from and to dates
	const hourDiff = toDate.diff(fromDate, "hours").toObject().hours;

	// Make sure to date is after from date
	if (fromDate > toDate || !hourDiff || hourDiff < 0) {
		throw error(400, '🤦‍♂️ The "to" date must be later than the "from" date');
	}

	// Return error of DB limit is exceeded
	if (hourDiff > LIMIT) {
		throw error(400, `😞 Period is too long, requested ${hourDiff} datapoints, but no more than ${LIMIT} is allowed`);
	}

	// Call supabase to check if data is available for the date range
	const { supabaseClient } = await getSupabase(event);
	const { data: tableData } = await supabaseClient.from('spot').select('price_dkk, price_area, hour_utc')
		.gte('hour_utc', fromDate.toUTC())
		.lte("hour_utc", toDate.toUTC());
	console.log("🗄 ", `Got ${tableData?.length} datapoints from Database, expected ${hourDiff}`);

	if (tableData && tableData?.length > hourDiff) {
		throw error(500, '😱 Found more datapoints than expected');
	}

	// If we miss datapoints
	if (!tableData || tableData.length < hourDiff) {

		const safeTableData = tableData ?? [];

		// Get data from external API
		const apiData = await getSpotDataFromDataService(fromDate, toDate, priceArea);
		if (!apiData.records || !apiData.records.length) {
			throw error(500, `Got 0 records from API.`);
		}
		console.log("🌍", `Got ${apiData.records.length} datapoints from api, expected ${hourDiff}`);

		// Filter Data to only insert missing rows (constraint on hour_utc && price_area)
		const filteredData = apiData.records
			.filter(({ HourUTC, PriceArea }) =>
				!safeTableData?.some(({ hour_utc, price_area }) => dateAsEpoc(HourUTC) === dateAsEpoc(hour_utc) && PriceArea === price_area));

		// Save data to Database
		console.log("⏳", `Saving ${filteredData.length} datapoints from api to database`);
		const { data: insertedData, error: dbError } = await supabaseClient
			.from('spot')
			.insert(filteredData?.map(({ SpotPriceDKK, PriceArea, HourUTC }) => ({
				price_dkk: SpotPriceDKK,
				price_area: PriceArea,
				hour_utc: HourUTC
			})))
			.select('price_dkk, price_area, hour_utc');

		if (dbError) {
			throw error(500, `😢 DB insert failed with: ${JSON.stringify(dbError)}`);
		}
		// Return data
		console.log("✅", `Returning ${[...safeTableData, ...insertedData].length} datapoints from api and database`);
		return json([...safeTableData, ...insertedData]);
	}

	// Data already in DB, lets return it
	console.log("✅", `Returning ${tableData?.length} datapoints from database`);
	return json(tableData);
};

/**
 * Convert ISO date string to epoc.  
 *  _**!!:** The string must be utc timezone._
 * @param date An ISO date string to get as epoc
 * @returns {number} Date as epoc number
 */
const dateAsEpoc = (date: string): number => DateTime.fromISO(date, { zone: "utc" }).toSeconds()
