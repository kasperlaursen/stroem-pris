import type { InternalError } from '$lib/types/api';

import { DateTime } from 'luxon';
import type { PageLoad } from './$types';
import type { InternalApiResponse } from '$lib/types/api';
import type { PriceAreas } from '$lib/energidataservice/types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';

type Fetch = (input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<Response>;

export const load: PageLoad = async (event) => {
	const { fetch, url } = event;
	const { session } = await getSupabase(event);
	if (!session) {
		throw redirect(303, '/');
	}

	const errors: InternalError[] = [];

	const priceArea = url.searchParams.get('area') == 'DK2' ? 'DK2' : 'DK1';

	const month = url.searchParams.get('month')
		? Number(url.searchParams.get('month'))
		: DateTime.now().month;
	const monthFrom = DateTime.fromObject({ day: 1, month, year: DateTime.now().year }).toISODate();
	const monthTo = DateTime.fromObject({
		day: 1,
		month: month + 1,
		year: DateTime.now().year
	}).toISODate();

	const { usageMeterData, errors: usageMeterErrors } = await getusageMeterForMonth(
		fetch,
		monthFrom,
		monthTo
	);
	errors.concat(usageMeterErrors);

	const { spotData, errors: spotErrors } = await getSpotForMonth(
		fetch,
		monthFrom,
		monthTo,
		priceArea
	);
	errors.concat(spotErrors);

	return {
		usageMeterData,
		spotData,
		priceArea,
		month,
		errors
	};
};

const getusageMeterForMonth = async (fetch: Fetch, monthFrom: string, monthTo: string) => {
	const usageMeterRequest = await fetch(`/api/meter/?from=${monthFrom}&to=${monthTo}`);
	const usageMeterResponse = (await usageMeterRequest.json()) as InternalApiResponse<
		{
			hour_utc: string;
			meter_id: string;
			measurement: number;
		}[]
	>;

	const errors: InternalError[] = [];

	if (usageMeterResponse.success === false) {
		errors.push(usageMeterResponse.error);
	}

	let usageMeterData: {
		measurement: number;
		meterId: string;
		hourUTC: DateTime;
	}[] = [];

	if (usageMeterResponse.success === true) {
		usageMeterData = usageMeterResponse.data.map(({ measurement, hour_utc, meter_id }) => ({
			measurement,
			meterId: meter_id,
			hourUTC: DateTime.fromISO(hour_utc, { zone: 'utc' })
		}));
	}

	return { errors, usageMeterData };
};

const getSpotForMonth = async (
	fetch: Fetch,
	monthFrom: string,
	monthTo: string,
	priceArea: string
) => {
	const spotRequest = await fetch(`/api/spot/?from=${monthFrom}&to=${monthTo}&area=${priceArea}`);
	const spotResponse = (await spotRequest.json()) as InternalApiResponse<
		{
			price_area: PriceAreas;
			hour_utc: string;
			price_dkk: number;
		}[]
	>;

	const errors: InternalError[] = [];

	if (spotResponse.success === false) {
		errors.push(spotResponse.error);
	}

	let spotData: {
		priceArea: PriceAreas;
		hourUTC: DateTime;
		priceDKK: number;
	}[] = [];

	if (spotResponse.success === true) {
		spotData = spotResponse.data.map(({ price_area, hour_utc, price_dkk }) => ({
			priceArea: price_area,
			priceDKK: price_dkk / 1000,
			hourUTC: DateTime.fromISO(hour_utc, { zone: 'utc' })
		}));
	}
	return { errors, spotData };
};
