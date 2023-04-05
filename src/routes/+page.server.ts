import { spot } from '$lib/data/spot';
import type { PriceAreas } from '$lib/data/spot/energidataservice/types';
import type { SpotData } from '$lib/data/spot/types';
import type { InternalError } from '$lib/types/InternalResponse';
import { DateTime } from 'luxon';
import type { PageServerLoad } from './$types';
import { getFees, type Fees } from '$lib/data/fees/getFees';

interface PageData {
	/** Spot data for the given range */
	spotData?: SpotData[];
	/** Spot average for the last 30 days */
	spotAverage?: number;
	/** Max spot value of the returned spotData */
	spotMax?: number;
	/** Fees data used to calculate full price */
	feesData?: Fees[];
}

interface PageResponse {
	data: PageData;
	errors?: InternalError[];
	area: PriceAreas;
}

export const load: PageServerLoad = async ({
	url,
	fetch,
	locals: { supabase }
}): Promise<PageResponse> => {
	const { from: defualtFrom, to: defaultTo } = getDefaultRange();
	const dateParam = url.searchParams.get('date');

	const area = url.searchParams.get('area') === 'DK2' ? 'DK2' : 'DK1';
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
		supabaseClient: supabase,
		customFetch: fetch
	});
	const spotAverageRequest = spot.getAverage({ days: 30, area, supabaseClient: supabase });

	const feesDataRequest = getFees({ supabaseClient: supabase });

	const [spotData, spotAverage, feesData] = await Promise.all([
		spotDataRequest,
		spotAverageRequest,
		feesDataRequest
	]);

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

	return { from, to };
};
