import type { PriceAreas } from './../lib/energidataservice/types';
import { DateTime } from 'luxon';
import type { PageLoad } from './$types';
import type { FeeKeys } from '$lib/types/fees';

export const load: PageLoad = async ({ fetch, url }) => {
	const priceArea = url.searchParams.get('area') == 'DK2' ? 'DK2' : 'DK1';
	const todayFrom = DateTime.now().toFormat('yyyy-MM-dd');
	const todayTo = DateTime.now().plus({ days: 1 }).toFormat('yyyy-MM-dd');
	const todayResponse = await fetch(`/api/spot/?from=${todayFrom}&to=${todayTo}&area=${priceArea}`);
	const todayData = (await todayResponse.json()) as {
		price_area: PriceAreas;
		hour_utc: string;
		price_dkk: number;
	}[];

	const spotToday = todayData.map(({ price_area, hour_utc, price_dkk }) => ({
		priceArea: price_area,
		priceDKK: price_dkk,
		hourUTC: DateTime.fromISO(hour_utc, { zone: 'utc' })
	}));

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

	return { spotToday, priceArea, feesToday };
};

const getCurrentFeeByDateAndKey = (
	feesData: {
		from: string;
		key: FeeKeys;
		value: number;
	}[],
	feeKey: FeeKeys,
	date: DateTime
): number => {
	return feesData
		.filter(({ key, from }) => key === feeKey && DateTime.fromISO(from, { zone: 'utc' }) <= date)
		.reduce(function (r, a) {
			return DateTime.fromISO(r.from, { zone: 'utc' }) > DateTime.fromISO(a.from, { zone: 'utc' })
				? r
				: a;
		}).value;
};
