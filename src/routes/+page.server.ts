import { spot } from '$lib/data/spot';
import type { SpotData } from '$lib/data/spot/types';
import type { InternalError, InternalResponse } from '$lib/types/InternalResponse';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { Load } from '@sveltejs/kit';
import { DateTime, type NumberingSystem } from 'luxon';

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
}

export const load: Load = async (event): Promise<PageResponse> => {
	const { supabaseClient } = await getSupabase(event);
	const { from: defualtFrom, to: defaultTo } = getDefaultRange();
	const from = defualtFrom;
	const to = defaultTo;

	let errors: InternalError[] = [];
	let data: PageData = {};

	const spotDataRequest = spot.getForDateRange({ from, to, area: 'DK1', supabaseClient });
	const spotAverageRequest = spot.getAverage({ days: 30, area: 'DK1', supabaseClient });

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
		data
	};
};

const getDefaultRange = () => {
	const { year, month, day } = DateTime.now();
	const from = DateTime.fromObject({ year, month, day });
	const to = from.plus({ days: 1 });
	return { from, to };
};
