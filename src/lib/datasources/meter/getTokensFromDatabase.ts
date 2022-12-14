import type { InternalApiResponse } from '$lib/types/api';
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';

type DatahubTokensData = {
	data_token: any;
} & {
	refresh_token: any;
} & {
	data_token_expire_utc: any;
} & {
	usage_meter_id: any;
};

interface Params {
	supabaseClient: TypedSupabaseClient;
}
export const getTokensFromDatabase = async ({
	supabaseClient
}: Params): Promise<InternalApiResponse<DatahubTokensData>> => {
	const { data } = await supabaseClient
		.from('datahub_tokens')
		.select('data_token, refresh_token, data_token_expire_utc, usage_meter_id');

	if (!data || data.length === 0) {
		return {
			success: false,
			error: { code: 400, message: '🤷‍♂️ User has as empty datahub_tokens' }
		};
	}

	if (!data[0].usage_meter_id) {
		return { success: false, error: { code: 400, message: '🤷‍♂️ User has no usage_meter_id saved' } };
	}

	return { success: true, data: data[0] };
};
