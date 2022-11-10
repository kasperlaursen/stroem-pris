import type { PageLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		throw redirect(303, '/');
	}
	const { data: tokenData } = await supabaseClient.from('datahub_tokens').select('refresh_token');

	return {
		user: session.user,
		hasToken: tokenData && tokenData?.length > 0
	};
};
