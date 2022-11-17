import type { PageLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';
import type { PriceAreas } from '$lib/energidataservice/types';

export const load: PageLoad = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		throw redirect(303, '/');
	}
	const { data: tokenData } = await supabaseClient
		.from('datahub_tokens')
		.select('refresh_token, usage_meter_id');

	const { data: settingData, error } = await supabaseClient
		.from('user_settings')
		.select('price_area');

	console.log('settingData', settingData);

	const priceArea: PriceAreas = settingData?.[0]?.price_area ?? 'DK1';

	return {
		priceArea,
		user: session.user,
		meterId: tokenData?.[0]?.usage_meter_id ?? '',
		hasToken: Boolean(tokenData && tokenData?.[0]?.refresh_token)
	};
};
