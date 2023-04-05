import type { InternalResponse } from '$lib/types/InternalResponse';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

const InvalidCredentialsResponse: InternalResponse<null> = {
	success: false,
	error: { code: 400, message: 'Den indtastede email var ikke korrekte. Prøv igen.' }
};

export const load: PageServerLoad = async ({ locals: { getSession } }) => {
	const session = await getSession();
	if (session) {
		throw redirect(303, '/');
	}
};

export const actions: Actions = {
	reset: async ({ request, locals: { supabase } }) => {
		const supabaseClient = supabase;

		const formData = await request.formData();
		const email = formData.get('email');

		if (typeof email !== 'string') {
			return InvalidCredentialsResponse;
		}

		await supabaseClient.auth.resetPasswordForEmail(email);
		throw redirect(303, '/');
	}
};
