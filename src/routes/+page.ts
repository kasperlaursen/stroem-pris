import type { PriceAreas } from './../lib/energidataservice/types';
import type { InternalError } from '$lib/types/api';

import { DateTime } from 'luxon';
import type { PageLoad } from './$types';
import type { FeeKeys } from '$lib/types/fees';
import type { InternalApiResponse } from '$lib/types/api';
import { getCurrentFeeByDateAndKey } from '$lib/utils/fees';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

type SpotHour = {
	priceArea: PriceAreas;
	hourUTC: DateTime;
	priceDKK: number;
};

export const load: PageLoad = async (event) => {
	const { fetch, url } = event;
	const priceArea = url.searchParams.get('area') == 'DK2' ? 'DK2' : 'DK1';
	const dateParam = url.searchParams.get('date');
	const isValidDate =
		dateParam &&
		DateTime.fromISO(dateParam).toMillis() <= DateTime.now().plus({ days: 1 }).toMillis();
	const todayFrom = isValidDate ? dateParam : DateTime.now().toISODate();
	const todayTo = isValidDate
		? DateTime.fromISO(dateParam).plus({ days: 1 }).toISODate()
		: DateTime.now().plus({ days: 2 }).toISODate();

	const spotResponse = await fetch(`/api/spot/?from=${todayFrom}&to=${todayTo}&area=${priceArea}`);
	const spotData = (await spotResponse.json()) as InternalApiResponse<
		{
			price_area: PriceAreas;
			hour_utc: string;
			price_dkk: number;
		}[]
	>;

	const { supabaseClient } = await getSupabase(event);

	const spotLast30Days = await supabaseClient
		.from('spot')
		.select('price_dkk')
		.gt('hour_utc', DateTime.fromISO(todayFrom).minus({ days: 30 }).toISODate());
	const { data } = spotLast30Days;
	const averageLast30Days = data ? data.reduce((a, b) => a + b.price_dkk, 0) / data.length : null;

	const errors: InternalError[] = [];

	if (dateParam && !isValidDate) {
		errors.push({ message: `Data findes ikke senere end ${todayTo}, viser data for i dag.` });
	}

	if (spotData.success === false) {
		errors.push(spotData.error);
	}

	let spotToday: null | SpotHour[] = null;

	if (spotData.success === true) {
		spotToday = spotData.data.map(({ price_area, hour_utc, price_dkk }) => ({
			priceArea: price_area,
			priceDKK: price_dkk,
			hourUTC: DateTime.fromISO(hour_utc, { zone: 'utc' })
		}));
	}

	const feesResponse = await fetch(`/api/fees`);
	const feesData = (await feesResponse.json()) as {
		from: string;
		key: FeeKeys;
		value: number;
	}[];

	const feesToday: { [fee in FeeKeys]: number } = {
		balancetarif: getCurrentFeeByDateAndKey(
			feesData,
			'balancetarif',
			DateTime.now().set({ hour: 0, minute: 0, second: 0 })
		),
		elafgift: getCurrentFeeByDateAndKey(
			feesData,
			'elafgift',
			DateTime.now().set({ hour: 0, minute: 0, second: 0 })
		),
		systemtarif: getCurrentFeeByDateAndKey(
			feesData,
			'systemtarif',
			DateTime.now().set({ hour: 0, minute: 0, second: 0 })
		),
		transmissionstarif: getCurrentFeeByDateAndKey(
			feesData,
			'transmissionstarif',
			DateTime.now().set({ hour: 0, minute: 0, second: 0 })
		)
	};

	return {
		averageLast30Days,
		spotToday,
		priceArea,
		feesToday,
		date: todayFrom,
		errors,
		message: spotData.success ? spotData.message : null
	};
};
