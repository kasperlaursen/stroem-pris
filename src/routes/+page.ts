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
	console.log({ area });
	const from = dateParam ? DateTime.fromISO(dateParam) : defualtFrom;
	const to = dateParam ? DateTime.fromISO(dateParam).plus({ days: 1 }) : defaultTo;

	let errors: InternalError[] = [];
	let data: PageData = {};

	const spotDataRequest = spot.getForDateRange({ from, to, area, supabaseClient });
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
	console.log(errors);
	return {
		errors,
		data,
		area
	};
};

const getDefaultRange = () => {
	const { year, month, day, hour } = DateTime.now().setZone('UTC');
	const from = DateTime.fromObject({ year, month, day, hour }).minus({ hours: 11 });
	const to = from.plus({ days: 1 });
	return { from, to };
};
