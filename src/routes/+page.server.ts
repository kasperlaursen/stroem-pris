import { spot } from '$lib/data/spot';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { Load } from '@sveltejs/kit';
import { DateTime } from 'luxon';

export const load: Load = async (event) => {
	const { supabaseClient } = await getSupabase(event);
	const { from: defualtFrom, to: defaultTo } = getDefaultRange();
	const from = defualtFrom;
	const to = defaultTo;

	const spotData = await spot.getForDateRange({ from, to, area: 'DK1', supabaseClient });

	if (spotData.success === false) {
		return spotData;
	}
	return spotData;
};

const getDefaultRange = () => {
	const { year, month, day } = DateTime.now();
	const from = DateTime.fromObject({ year, month, day });
	const to = from.plus({ days: 1 });
	return { from, to };
};
