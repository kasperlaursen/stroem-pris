import type { PageLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		return {
			isUser: false,
			meterId: null,
			hasToken: null
		};
	}
	const { data: tokenData } = await supabaseClient
		.from('datahub_tokens')
		.select('refresh_token, usage_meter_id');

	return {
		isUser: true,
		meterId: tokenData?.[0]?.usage_meter_id ?? '',
		hasToken: Boolean(tokenData && tokenData?.[0]?.refresh_token)
	};
};
