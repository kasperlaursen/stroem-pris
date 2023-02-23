import type { InternalResponse } from '$lib/types/InternalResponse';
import { returnError } from '$lib/utils/returnError';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { RequestEvent } from '@sveltejs/kit';

export const setPassword = async (event: RequestEvent<any>): Promise<InternalResponse<null>> => {
	// TODO: Require and handle repeat password
	const { request } = event;
	const { supabaseClient } = await getSupabase(event);
	const formData = await request.formData();
	const password = formData.get('password');

	if (typeof password !== 'string') {
		return returnError(400, 'Det indtastede kodeoed er ikke validt.');
	}

	const { error: setPasswordError } = await supabaseClient.auth.updateUser({
		password
	});

	if (setPasswordError) {
		return returnError(400, setPasswordError.message);
	}

	return { success: true, data: null };
};
