import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	setPassword: async (event) => {
		// TODO: Require and handle repeat password
		const { request } = event;
		const { supabaseClient } = await getSupabase(event);
		const formData = await request.formData();
		const password = formData.get('password') as string;
		await supabaseClient.auth.updateUser({
			password
		});
		throw redirect(303, '/guide');
	}
};
