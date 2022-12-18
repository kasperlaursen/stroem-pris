import type { PriceAreas } from '$lib/energidataservice/types';
import type { DateTime } from 'luxon';
import { PUBLIC_ENTSOE_TOKEN } from '$env/static/public';

type PriceAreaMap = {
	[key in PriceAreas]: string;
};

const priceAreas: PriceAreaMap = {
	DK1: '10YDK-1--------W',
	DK2: '10YDK-2--------M'
} as const;

interface Params {
	priceArea: keyof typeof priceAreas;
	dateFrom: DateTime;
	dateTo: DateTime;
}

const BASE_URL = 'https://web-api.tp.entsoe.eu/api';

export const dayAHeadPrices = async ({ priceArea, dateFrom, dateTo }: Params) => {
	const periodStart = dateFrom.minus({ hours: 1 }).toFormat('yyyyMMddHHmm');
	const periodEnd = dateTo.minus({ hours: 1 }).toFormat('yyyyMMddHHmm');

	const requestParameters = {
		securityToken: PUBLIC_ENTSOE_TOKEN,
		documentType: 'A44',
		out_Domain: priceAreas[priceArea],
		in_Domain: priceAreas[priceArea],
		periodStart,
		periodEnd
	};
	const queryString = new URLSearchParams(requestParameters);
	const requestUrl = `${BASE_URL}?${queryString}`;
	const response = await fetch(requestUrl);
	const data = await response.text();

	console.log({ data });
};
