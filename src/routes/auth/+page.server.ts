import type { InternalResponse } from '$lib/types/InternalResponse';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, redirect, type Actions, type Load } from '@sveltejs/kit';

export const load: Load = async (event) => {
	const { session } = await getSupabase(event);
	if (session) {
		throw redirect(303, '/');
	}
};

const InvalidCredentialsResponse: InternalResponse<null> = {
	success: false,
	error: { code: 400, message: 'De indtastede login oplysninger var ikke korrekte. Prøv igen.' }
};

export const actions: Actions = {
	signin: async (event) => {
		const { request } = event;
		const { supabaseClient } = await getSupabase(event);
		const formData = await request.formData();

		const email = formData.get('email');
		const password = formData.get('password');

		if (typeof email !== 'string' || typeof password !== 'string') {
			return InvalidCredentialsResponse;
		}

		const { error: signinError } = await supabaseClient.auth.signInWithPassword({
			email,
			password
		});

		if (signinError) {
			if (signinError.status === 400) {
				return InvalidCredentialsResponse;
			}
			throw error(500, {
				message: 'Der er sket en server fejl. Prøv venligst igen.'
			});
		}

		throw redirect(303, '/');
	},
	signout: async (event) => {
		const { supabaseClient } = await getSupabase(event);
		await supabaseClient.auth.signOut();
		throw redirect(303, '/');
	}
};
