import type { InternalResponse } from '$lib/types/InternalResponse';
import { returnError } from '$lib/utils/returnError';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { RequestEvent } from '@sveltejs/kit';

export const setPassword = async (
	event: RequestEvent,
	supabaseClient: SupabaseClient
): Promise<InternalResponse<null>> => {
	// TODO: Require and handle repeat password
	const { request } = event;
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
