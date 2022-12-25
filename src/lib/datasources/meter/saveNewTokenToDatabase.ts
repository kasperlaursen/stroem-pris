import type { Session } from '@supabase/supabase-js';
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import { DateTime } from 'luxon';

interface Params {
	token: string;
	supabaseClient: TypedSupabaseClient;
	session: Session;
}

export const saveNewTokenToDatabase: (params: Params) => Promise<void> = async ({
	token,
	supabaseClient,
	session
}) => {
	console.log('📊 🗄', `Saving token`);
	const { data, error } = await supabaseClient
		.from('datahub_tokens')
		.update({
			data_token: token,
			data_token_expire_utc: DateTime.now().plus({ hours: 24 }).toISO()
		})
		.eq('user_id', session.user.id);

	if (error) {
		console.log('📊 🚫', `Token save failed!`, error);
	}
	console.log('📊 ✅', `Token save OK!`);
	return;
};
