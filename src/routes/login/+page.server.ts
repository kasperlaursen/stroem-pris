import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { AuthHelperError } from '@supabase/auth-helpers-shared';
import { invalid, redirect, type Actions } from '@sveltejs/kit';
import type { PageLoad } from '.svelte-kit/types/src/routes/profile/$types';

export const load: PageLoad = async (event) => {
	const { session } = await getSupabase(event);
	if (session) {
		throw redirect(303, '/');
	}
};

export const actions: Actions = {
	signin: async (event) => {
		console.log('ℹ️', 'signin');
		const { request } = event;
		const { supabaseClient } = await getSupabase(event);
		const formData = await request.formData();

		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

		if (error) {
			console.log('❌', 'Failed with error: ', JSON.stringify(error));
			if (error.status === 400) {
				return invalid(400, {
					error: 'Invalid credentials.',
					values: {
						email
					}
				});
			}
			return invalid(500, {
				error: 'Server error. Try again later.',
				values: {
					email
				}
			});
		}

		throw redirect(303, '/profile');
	},

	reset: async (event) => {
		const { request } = event;
		const { supabaseClient } = await getSupabase(event);
		const formData = await request.formData();
		const email = formData.get('email') as string;
		await supabaseClient.auth.resetPasswordForEmail(email);
		throw redirect(303, '/');
	}
};
