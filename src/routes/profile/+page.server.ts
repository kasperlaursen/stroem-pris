import type { Actions } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, invalid } from '@sveltejs/kit';

export const actions: Actions = {
	updateProfile: async (event) => {
		const { request } = event;
		const { session, supabaseClient } = await getSupabase(event);
		if (!session) {
			// the user is not signed in
			throw error(403, { message: 'Unauthorized' });
		}
		// we are save, let the user create the post
		const formData = await request.formData();
		const profileText = formData.get('profileText');

		const { error: updateProfileError, data: newProfile } = await supabaseClient
			.from('profiles')
			.upsert({ id: session.user.id, profile_text: profileText });

		if (updateProfileError) {
			console.log(updateProfileError);
			return invalid(500, {
				supabaseErrorMessage: updateProfileError.message
			});
		}
		return {
			newProfile
		};
	}
};
