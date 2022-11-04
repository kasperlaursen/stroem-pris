import type { PriceAreas } from './../lib/energidataservice/types';
import { DateTime } from 'luxon';
import type { PageLoad } from './$types';
import type { FeeKeys } from '$lib/types/fees';

export const load: PageLoad = async ({ fetch, url }) => {
	const priceArea = url.searchParams.get('area') == 'DK2' ? 'DK2' : 'DK1';
	const dateParam = url.searchParams.get('date');
	const isValidDate =
		dateParam &&
		DateTime.fromISO(dateParam).toMillis() <= DateTime.now().plus({ days: 1 }).toMillis();
	const todayFrom = isValidDate ? dateParam : DateTime.now().toISODate();
	const todayTo = isValidDate
		? DateTime.fromISO(dateParam).plus({ days: 1 }).toISODate()
		: DateTime.now().plus({ days: 1 }).toISODate();
	const todayResponse = await fetch(`/api/spot/?from=${todayFrom}&to=${todayTo}&area=${priceArea}`);
	const todayData = (await todayResponse.json()) as {
		price_area: PriceAreas;
		hour_utc: string;
		price_dkk: number;
	}[];

	console.log(todayFrom, todayTo);

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

	return { spotToday, priceArea, feesToday, date: todayFrom };
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
