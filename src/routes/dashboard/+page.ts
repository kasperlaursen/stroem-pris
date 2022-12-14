import { getMeterDataForPeriod } from '$lib/datasources/meter/getMeterData';
import type { PriceAreas } from '$lib/energidataservice/types';
import type { InternalError, InternalApiResponse } from '$lib/types/api';
import type { FeeKeys } from '$lib/types/fees';
import type { PageLoad } from '.svelte-kit/types/src/routes/$types';
import type { Session } from '@supabase/supabase-js';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import { redirect } from '@sveltejs/kit';
import { DateTime } from 'luxon';

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
		month,
		year
	})
		.plus({ month: 1 })
		.toISODate();

	const userMonthlySettings = supabaseClient
		.from('user_monthly_settings')
		.select('fixed_price, flex_fee')
		.eq('month', DateTime.fromObject({ month, year }).toISODate());
	const usageMeterForMonth = getusageMeterForMonth(monthFrom, monthTo, session, supabaseClient);
	const spotForMonth = getSpotForMonth(fetch, monthFrom, monthTo, priceArea);
	const fees = await fetch(`/api/fees`);

	const results = await Promise.all([userMonthlySettings, usageMeterForMonth, spotForMonth, fees]);

	const { data: monthSettingData, error: monthSettingError } = results[0];
	const { data: usageMeterData, errors: usageMeterErrors } = results[1];
	const { data: spotData, errors: spotErrors } = results[2];
	const feesData = (await results[3].json()) as {
		from: string;
		key: FeeKeys;
		value: number;
	}[];

	if (monthSettingError) console.log(monthSettingError);

	errors.concat(usageMeterErrors);
	errors.concat(spotErrors);

	return {
		usageMeterData,
		feesData,
		spotData,
		priceArea,
		month,
		year,
		errors,
		elafgift: show_fees,
		tariffer: show_tariff,
		moms: show_vat,
		fixedPrice: monthSettingData?.[0]?.fixed_price,
		flexFee: monthSettingData?.[0]?.flex_fee
	};
};

const getusageMeterForMonth = async (
	monthFrom: string,
	monthTo: string,
	session: Session,
	supabaseClient: TypedSupabaseClient
) => {
	const errors: InternalError[] = [];

	const usageMeterResponse = await getMeterDataForPeriod({
		fromDateString: monthFrom,
		toDateString: monthTo,
		session,
		supabaseClient
	});

	if (usageMeterResponse.success === false) {
		console.log('errors');
		errors.push(usageMeterResponse.error);
	}

	let usageMeterData: {
		measurement: number;
		meterId: string;
		hourUTC: string;
	}[] = [];

	if (usageMeterResponse.success === true) {
		usageMeterData = usageMeterResponse.data.map(({ measurement, hour_utc, meter_id }) => ({
			measurement,
			meterId: meter_id,
			hourUTC: hour_utc
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
		hourUTC: string;
		priceDKK: number;
	}[] = [];

	if (spotResponse.success === true) {
		spotData = spotResponse.data.map(({ price_area, hour_utc, price_dkk }) => ({
			priceArea: price_area,
			priceDKK: price_dkk / 1000,
			hourUTC: hour_utc
		}));
	}
	return { errors, data: spotData };
};
