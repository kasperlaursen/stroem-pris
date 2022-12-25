import { getData, getToken } from '$lib/eloverblik/api';
import type { InternalApiResponse } from '$lib/types/api';
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import { DateTime } from 'luxon';
import type { Session } from '@supabase/supabase-js';
import { saveNewTokenToDatabase } from '$lib/datasources/meter/saveNewTokenToDatabase';
import type { Result } from '$lib/eloverblik/types';

interface Params {
	dataToken?: string;
	usageMeterId: string;
	refreshToken: string;
	dataTokenExpireUTC: string;
	supabaseClient: TypedSupabaseClient;
	session: Session;
	fromDate: DateTime;
	toDate: DateTime;
}

export const getMeterDataFromExternalSource = async ({
	dataToken,
	usageMeterId,
	dataTokenExpireUTC,
	refreshToken,
	supabaseClient,
	session,
	fromDate,
	toDate
}: Params): Promise<InternalApiResponse<Result[]>> => {
	if (!refreshToken) {
		return { success: false, error: { code: 400, message: '🔐 User has no refresh_token saved' } };
	}

	const validTokenResonse = await getValidDataToken({
		dataToken,
		dataTokenExpireUTC,
		refreshToken
	});
	if (validTokenResonse.success === false) {
		return validTokenResonse;
	}

	const { data: validToken } = validTokenResonse;

	const saveToken = saveNewTokenToDatabase({
		supabaseClient,
		session,
		token: validToken
	});

	const meterDataResponse = getData(validToken, fromDate.toISODate(), toDate.toISODate(), [
		usageMeterId
	]);

	const results = await Promise.all([meterDataResponse, saveToken]);
	console.log('🐞', 'Got Datahub response.');
	const meterResponse = results[0];

	if (meterResponse.success === false && meterResponse.error.code === 401) {
		console.log(`📊 🚫`, `Got INVALID response from Datahub.`);
		invalidateSavedToken({ supabaseClient, session });
	}

	return meterResponse;
};

const getValidDataToken = async ({
	dataToken,
	dataTokenExpireUTC,
	refreshToken
}: Pick<Params, 'dataToken' | 'dataTokenExpireUTC' | 'refreshToken'>): Promise<
	InternalApiResponse<string>
> => {
	const hasDataToken = dataToken;
	const dataTokenIsValid = DateTime.fromISO(dataTokenExpireUTC).diffNow('minutes').minutes > 10;
	console.log('📊 🔑', 'Validate Token', { hasDataToken: Boolean(hasDataToken), dataTokenIsValid });
	if (hasDataToken && dataTokenIsValid) {
		console.log('📊 🔑', 'Existing token is valid');
		return { success: true, data: dataToken };
	}
	const tokenResponse = await getToken(refreshToken);
	if (!tokenResponse.success) {
		return tokenResponse;
	}
	return { success: true, data: tokenResponse.data.token };
};

interface InvalidateParams {
	supabaseClient: TypedSupabaseClient;
	session: Session;
}

const invalidateSavedToken = async ({ supabaseClient, session }: InvalidateParams) => {
	console.log(`📊 🚫`, `Invalidate saved Token`);
	await supabaseClient
		.from('datahub_tokens')
		.update({
			data_token: '',
			data_token_expire_utc: ''
		})
		.eq('user_id', session.user.id);
};
