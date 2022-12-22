import type { InternalResponse } from '$lib/types/InternalResponse';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { RequestEvent } from '@sveltejs/kit';

export const setPassword = async (event: RequestEvent<any>): Promise<InternalResponse<null>> => {
	// TODO: Require and handle repeat password
	const { request } = event;
	const { supabaseClient } = await getSupabase(event);
	const formData = await request.formData();
	const password = formData.get('password');

	if (typeof password !== 'string') {
		return {
			success: false,
			error: { code: 400, message: 'Det indtastede kodeoed er ikke validt.' }
		};
	}

	const { error: setPasswordError } = await supabaseClient.auth.updateUser({
		password
	});

	if (setPasswordError) {
		return {
			success: false,
			error: { code: 400, message: setPasswordError.message }
		};
	}

	return { success: true, data: null };
};
