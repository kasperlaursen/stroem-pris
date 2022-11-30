import type { InternalError } from '$lib/types/api';

import { DateTime } from 'luxon';
import type { PageLoad } from './$types';
import type { InternalApiResponse } from '$lib/types/api';
import type { PriceAreas } from '$lib/energidataservice/types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';
import type { FeeKeys } from '$lib/types/fees';

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
		throw redirect(303, '/settings');
	}

	const errors: InternalError[] = [];

	const { data: settingData, error } = await supabaseClient
		.from('user_settings')
		.select('price_area, show_vat, show_fees, show_tariff');

	const { show_vat, show_fees, show_tariff } = settingData?.[0] ?? {
		show_vat: true,
		show_feesshow_vat: true,
		show_tariffshow_vat: true
	};

	const priceArea: PriceAreas =
		url.searchParams.get('area') === 'DK1'
			? 'DK1'
			: url.searchParams.get('area') === 'DK2'
			? 'DK2'
			: settingData?.[0]?.price_area === 'DK2'
			? 'DK2'
			: 'DK1';

	const month = url.searchParams.get('month')
		? Number(url.searchParams.get('month'))
		: DateTime.now().month;
	const year = url.searchParams.get('year')
		? Number(url.searchParams.get('year'))
		: DateTime.now().year;
	const monthFrom = DateTime.fromObject({ day: 1, month, year }).toISODate();
	const monthTo = DateTime.fromObject({
		day: 1,
		month: month + 1,
		year
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

	const feesResponse = await fetch(`/api/fees`);
	const feesData = (await feesResponse.json()) as {
		from: string;
		key: FeeKeys;
		value: number;
	}[];

	return {
		usageMeterData,
		feesData,
		spotData,
		priceArea,
		month,
		year,
		errors,
		elafgift: show_fees,
		tariffer: show_fees,
		moms: show_vat
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
