import type { Actions } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, invalid, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	setToken: async (event) => {
		const { request } = event;
		const { session, supabaseClient } = await getSupabase(event);
		if (!session) {
			// the user is not signed in
			throw error(403, { message: 'Unauthorized' });
		}
		// we are save, let the user create the post
		const formData = await request.formData();
		const token = formData.get('token');

		console.log(token);
		const { error: setTokenError } = await supabaseClient
			.from('datahub_tokens')
			.upsert({ user_id: session.user.id, refresh_token: token });

		if (setTokenError) {
			console.log(setTokenError);
			return invalid(500, {
				supabaseErrorMessage: setTokenError.message
			});
		}
		throw redirect(303, '/profile');
	},
	deleteToken: async (event) => {
		const { request } = event;
		const { session, supabaseClient } = await getSupabase(event);
		if (!session) {
			// the user is not signed in
			throw error(403, { message: 'Unauthorized' });
		}

		const { error: setTokenError } = await supabaseClient
			.from('datahub_tokens')
			.delete()
			.eq('user_id', session.user.id);

		if (setTokenError) {
			console.log(setTokenError);
			return invalid(500, {
				supabaseErrorMessage: setTokenError.message
			});
		}
		throw redirect(303, '/profile');
	}
};
