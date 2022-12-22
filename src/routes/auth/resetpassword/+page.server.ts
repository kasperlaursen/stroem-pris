import type { InternalResponse } from '$lib/types/InternalResponse';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, redirect, type Actions } from '@sveltejs/kit';

const InvalidCredentialsResponse: InternalResponse<null> = {
	success: false,
	error: { code: 400, message: 'Det indtastede kodeoed er ikke validt.' }
};

export const actions: Actions = {
	setPassword: async (event) => {
		// TODO: Require and handle repeat password
		const { request } = event;
		const { supabaseClient } = await getSupabase(event);
		const formData = await request.formData();
		const password = formData.get('password');

		if (typeof password !== 'string') {
			return InvalidCredentialsResponse;
		}

		const { error: setPasswordError } = await supabaseClient.auth.updateUser({
			password
		});

		if (setPasswordError) {
			throw error(500, {
				message: 'Der er sket en server fejl. Prøv venligst igen.'
			});
		}

		throw redirect(303, '/');
	}
};
