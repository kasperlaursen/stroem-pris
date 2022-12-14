import { getMeterDataForPeriod } from '$lib/datasources/meter';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	console.log('📊 🆕', `Meter api request`);
	const { url } = event;

	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		console.log('📊 ✋', `Requester is not signed in`);
		throw error(403, `🔐 The user is not signed in`);
	}

	const fromDateParam = url.searchParams.get('from');
	const toDateParam = url.searchParams.get('to');

	const meterDataForPeriod = await getMeterDataForPeriod({
		fromDateString: fromDateParam,
		toDateString: toDateParam,
		session,
		supabaseClient
	});

	return json(meterDataForPeriod);
};
