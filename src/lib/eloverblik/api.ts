import type { InternalApiResponse } from '$lib/types/api';
import { BASE_PATH } from './constants';
import type { APIResponse, Result } from './types';

/**
 * Get an Eloverblik token from a users refresh_token.
 *
 * @param refreshToken The refresh_token saved in the DB by the user.
 * @returns A token used to get data from the users meters.
 */
export const getToken = async (
	refreshToken: string
): Promise<InternalApiResponse<{ token: string }>> => {
	console.log(`📊 🌍`, `Calling datahub for new Token...`);
	const response = await fetch(`${BASE_PATH}/token`, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${refreshToken}`
		}
	});

	switch (response.status) {
		case 200:
			const token = (await response.json()).result;
			if (token) {
				return { success: true, data: { token } };
			}
		case 429:
		case 503:
			return {
				success: false,
				error: {
					message: 'Eloverblik.dk har travlt. Prøv igen om 2 minutter. '
				}
			};
		case 401:
		case 403:
			return {
				success: false,
				error: {
					message:
						'Din indtastede token til Eloverblik.dk blev ikke accepteret. Venligst opdater din token på profil siden.'
				}
			};
		default:
			return {
				success: false,
				error: {
					message: 'Der er sket en uventet fejl i forsøget på at logge dig ind på Eloverblik.dk'
				}
			};
	}
};

/**
 * Get data from Energioverblik between two datas form the specified meteringPoints.
 *
 * @param token The users data_token for Energioverblik
 * @param from The from date in ISODate format
 * @param to The to date in ISODate format
 * @param meteringPoints An array of meterinf point ids
 * @returns The resolinse from eloverblik gettimeseries endpoint
 */
export const getData = async (
	token: string,
	from: string,
	to: string,
	meteringPoints: string[]
): Promise<InternalApiResponse<Result[]>> => {
	console.log(`📊 🌍`, `Calling datahub for data between ${from} and ${to}...`);

	// TODO: Validate date formats
	const response = await fetch(`${BASE_PATH}/meterdata/gettimeseries/${from}/${to}/Hour`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: `{ "meteringPoints": { "meteringPoint": ["${meteringPoints[0]}"]}}`
	});

	if (response.status === 200) {
		const data = ((await response.json()) as APIResponse).result;

		if (data) {
			return { success: true, data };
		}
	}

	return {
		success: false,
		error: {
			message: 'Der er sket en uventet fejl i forsøget på at hente data fra Eloverblik.dk',
			code: response.status
		}
	};
};
