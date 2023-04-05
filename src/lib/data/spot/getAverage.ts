import type { InternalResponse } from '$lib/types/InternalResponse';
import { returnError } from '$lib/utils/returnError';
import { DateTime } from 'luxon';
import type { SpotBaseParams } from './types';
import type { SupabaseBaseParams } from '../types';

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
		return returnError(error?.code ?? 404, error?.message ?? 'No past spot data found...');
	}

	const relevantSpotItems = data.filter(hasPrice);

	const averageSpot =
		relevantSpotItems.reduce((accumulator, current) => accumulator + current.price_dkk, 0) /
		relevantSpotItems.length;

	return { success: true, data: averageSpot };
};

type Datapoint = { price_dkk: number | null };
type ValidDatapoint = { price_dkk: number };

const hasPrice = (dataPoint: Datapoint): dataPoint is ValidDatapoint =>
	dataPoint.price_dkk !== null;
