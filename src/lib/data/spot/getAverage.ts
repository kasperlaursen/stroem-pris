import type { InternalResponse } from '$lib/types/InternalResponse';
import { DateTime } from 'luxon';
import type { SpotBaseParams, SupabaseBaseParams } from './types';

export interface Params extends Pick<SpotBaseParams, 'area'>, SupabaseBaseParams {
	days: number;
}

/**
 * Calls supabase to get spot data for the last x days for the given area.
 * Then returns an average price if data exists.
 */
export const getAverage = async ({
	area,
	days,
	supabaseClient
}: Params): Promise<InternalResponse<number>> => {
	const firstDate = DateTime.now().minus({ days });
	const pastSpot = await supabaseClient
		.from('spot')
		.select('price_dkk')
		.eq('price_area', area)
		.gt('hour_utc', firstDate.toISODate());

	const { data, error } = pastSpot;

	if (!data || error) {
		return {
			success: false,
			error: {
				code: error.code ?? 404,
				message: error.message ?? 'No past spot data found...'
			}
		};
	}

	const averageSpot =
		data.reduce((accumulator, current) => accumulator + current.price_dkk, 0) / data.length;

	return { success: true, data: averageSpot };
};
