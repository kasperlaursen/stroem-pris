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
	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		throw redirect(303, '/');
	}

	const { data: tokenData } = await supabaseClient
		.from('datahub_tokens')
		.select('refresh_token, usage_meter_id');

	if (!tokenData || !tokenData?.[0]?.refresh_token || !tokenData?.[0]?.usage_meter_id) {
		throw redirect(303, '/profile');
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

	const { data: usageMeterData, errors: usageMeterErrors } = await getusageMeterForMonth(
		fetch,
		monthFrom,
		monthTo
	);
	errors.concat(usageMeterErrors);

	const { data: spotData, errors: spotErrors } = await getSpotForMonth(
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
	const errors: InternalError[] = [];
	const usageMeterRequest = await fetch(`/api/meter/?from=${monthFrom}&to=${monthTo}`);
	if (usageMeterRequest.status !== 200) {
		errors.push({ message: usageMeterRequest.statusText, code: usageMeterRequest.status });
		return { errors, data: [] };
	}

	const usageMeterResponse = (await usageMeterRequest.json()) as InternalApiResponse<
		{
			hour_utc: string;
			meter_id: string;
			measurement: number;
		}[]
	>;

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

	return { errors, data: usageMeterData };
};

const getSpotForMonth = async (
	fetch: Fetch,
	monthFrom: string,
	monthTo: string,
	priceArea: string
) => {
	const errors: InternalError[] = [];
	const spotRequest = await fetch(`/api/spot/?from=${monthFrom}&to=${monthTo}&area=${priceArea}`);
	if (spotRequest.status !== 200) {
		errors.push({ message: spotRequest.statusText, code: spotRequest.status });
		return { errors, data: [] };
	}
	const spotResponse = (await spotRequest.json()) as InternalApiResponse<
		{
			price_area: PriceAreas;
			hour_utc: string;
			price_dkk: number;
		}[]
	>;

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
	return { errors, data: spotData };
};
