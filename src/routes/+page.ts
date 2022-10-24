import type { PriceAreas } from './../lib/energidataservice/types';
import { DateTime } from 'luxon';
import type { PageLoad } from './$types';

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

	return { spotToday, priceArea };
};
