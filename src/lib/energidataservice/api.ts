import type { InternalApiResponse } from '$lib/types/api';
import type { DateTime } from 'luxon';
import type { PriceAreas, SpotResponse } from './types';

/**
 *  Function to call the energidataservice api to get spot data for a given day range, and area.
 * @param from {DateTime} The first date to get data points from.
 * @param to {DateTime} The last data point will be the last hour of the day before this date.
 * @param area {PriceAreas} The area to get data from.
 * @returns {SpotResponse} The api response as json.
 *
 * @example "Get the full month of January danish time": from="2022-01-01" to="2022-02-01".
 */
export const getSpotDataFromDataService = async (
	from: DateTime,
	to: DateTime,
	area: PriceAreas
): Promise<InternalApiResponse<SpotResponse>> => {
	const start = from.toFormat('yyyy-MM-dd');
	const end = to.toFormat('yyyy-MM-dd');
	console.log(`🌍 Calling Spot API for data between: ${start} AND ${end}`);

	const APIBase = 'https://api.energidataservice.dk/v2/dataset/Elspotprices';
	const request = await fetch(
		`${APIBase}?start=${start}&end=${end}&filter={"PriceArea":"${area}"}`
	);
	const data: SpotResponse = await request.json();

	// It should never be possible to get a response with less that 24 hours of data.
	// If we get less, the data is not useable, and we return and error.
	if (!data.total || data.total < 24) {
		return {
			success: false,
			error: {
				message:
					'Der findes desværre ikke data for den givne periode i energidataservice. Prøv en anden dato.'
			}
		};
	}

	return {
		success: true,
		data
	};
};
