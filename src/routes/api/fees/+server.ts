import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	console.log('💰', `Fees api request`);

	const { supabaseClient } = await getSupabase(event);
	const { data } = await supabaseClient.from('fees').select('from, key, value');

	if (!data || data.length < 4) {
		throw error(500, '😱 Failed to find valid fee data...');
	}

	return json(data);
};
