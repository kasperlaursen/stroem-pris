import type { InternalResponse } from '$lib/types/InternalResponse';
import { returnError } from '$lib/utils/returnError';
import type { SpotData, SupabaseBaseParams } from './types';

interface Params extends SupabaseBaseParams {
	newDataPoints: SpotData[];
}

export const saveSpotDataToDatabasse = async ({
	newDataPoints,
	supabaseClient
}: Params): Promise<InternalResponse<SpotData[]>> => {
	const { error } = await supabaseClient
		.from('spot')
		.insert(
			newDataPoints.map(({ priceDKK, priceArea, hourUTC }) => ({
				price_dkk: priceDKK,
				price_area: priceArea,
				hour_utc: hourUTC.toISOString()
			}))
		)
		.select('price_dkk, price_area, hour_utc');

	if (error) {
		return returnError(500, error.message);
	}

	return { success: true, data: newDataPoints };
};
