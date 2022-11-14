import type { PageLoad } from '.svelte-kit/types/src/routes/$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect, type Actions } from '@sveltejs/kit';

export const load: PageLoad = async (event) => {
	const { supabaseClient } = await getSupabase(event);
	await supabaseClient.auth.signOut();
	throw redirect(303, '/');
};
