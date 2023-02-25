import { spot } from '$lib/data/spot';
import type { PriceAreas } from '$lib/data/spot/energidataservice/types';
import type { SpotData } from '$lib/data/spot/types';
import type { InternalError } from '$lib/types/InternalResponse';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { Load } from '@sveltejs/kit';
import { DateTime } from 'luxon';

interface PageData {
	/** Spot data for the given range */
	spotData?: SpotData[];
	/** Spot average for the last 30 days */
	spotAverage?: number;
	/** Max spot value of the returned spotData */
	spotMax?: number;
}

interface PageResponse {
	data: PageData;
	errors?: InternalError[];
	area: PriceAreas;
}

export const load: Load = async (event): Promise<PageResponse> => {
	const { supabaseClient } = await getSupabase(event);
	const { from: defualtFrom, to: defaultTo } = getDefaultRange();
	const dateParam = event.url.searchParams.get('date');

	const area = event.url.searchParams.get('area') === 'DK2' ? 'DK2' : 'DK1';
	const from = dateParam ? DateTime.fromISO(dateParam, { zone: 'Europe/Copenhagen' }) : defualtFrom;
	const to = dateParam
		? DateTime.fromISO(dateParam, { zone: 'Europe/Copenhagen' }).plus({ days: 1 })
		: defaultTo;

	const errors: InternalError[] = [];
	const data: PageData = {};

	const spotDataRequest = spot.getForDateRange({
		from,
		to,
		area,
		supabaseClient,
		customFetch: event.fetch
	});
	const spotAverageRequest = spot.getAverage({ days: 30, area, supabaseClient });

	const [spotData, spotAverage] = await Promise.all([spotDataRequest, spotAverageRequest]);

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

	return {
		errors,
		data,
		area
	};
};

/**
 * Gets the default range.
 * If the current time is 13 or more, the full day tomorrow is included.
 * If the time is before 13, the last hour is today at midnight.
 *
 * This logic is based on the fact that the spot price api gets updated arround 13 to include the next day prices.
 */
const getDefaultRange = () => {
	const { year, month, day, hour } = DateTime.now().setZone('Europe/Copenhagen');
	const from = DateTime.fromObject({ year, month, day, hour }).minus({ hours: 11 });

	const lastHourToday = DateTime.fromObject({ year, month, day, hour: 24 });
	const lastExpectedData = hour >= 13 ? lastHourToday.plus({ day: 1 }) : lastHourToday;

	const to = lastExpectedData;

	console.log(from.toISO(), to.toISO());
	return { from, to };
};
