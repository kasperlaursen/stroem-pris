import type { InternalResponse } from '$lib/types/InternalResponse';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect, type Actions, type Load } from '@sveltejs/kit';

const InvalidCredentialsResponse: InternalResponse<null> = {
	success: false,
	error: { code: 400, message: 'Den indtastede email var ikke korrekte. Prøv igen.' }
};

export const load: Load = async (event) => {
	const { session } = await getSupabase(event);
	if (session) {
		throw redirect(303, '/');
	}
};

export const actions: Actions = {
	reset: async (event) => {
		const { request } = event;
		const { supabaseClient } = await getSupabase(event);

		const formData = await request.formData();
		const email = formData.get('email');

		if (typeof email !== 'string') {
			return InvalidCredentialsResponse;
		}

		await supabaseClient.auth.resetPasswordForEmail(email);
		throw redirect(303, '/');
	}
};
