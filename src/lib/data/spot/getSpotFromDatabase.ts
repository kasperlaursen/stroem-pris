import type { InternalResponse } from '$lib/types/InternalResponse';
import { returnError } from '$lib/utils/returnError';
import { DateTime } from 'luxon';
import type { PriceAreas } from './energidataservice/types';
import type { SpotBaseParams, SpotData, SupabaseBaseParams } from './types';

interface Params extends SpotBaseParams, SupabaseBaseParams {
	area: PriceAreas;
	/** The number of hours expected returned, used for error handling */
	hourDiff: number;
}

export const getSpotFromDatabase = async ({
	supabaseClient,
	from,
	to,
	area,
	hourDiff
}: Params): Promise<InternalResponse<SpotData[]>> => {
	const { data: tableData } = await supabaseClient
		.from('spot')
		.select('price_dkk, price_area, hour_utc')
		.eq('price_area', area)
		.gte('hour_utc', from.toUTC())
		.lt('hour_utc', to.toUTC());

	if (tableData && tableData?.length > hourDiff) {
		return returnError(500, '😱 Found more data point than expected');
	}

	if (!tableData) {
		return returnError(404, '0️⃣ No data found in table');
	}

	const spotData: SpotData[] = tableData.map(({ price_area, price_dkk, hour_utc }) => ({
		hourUTC: DateTime.fromISO(hour_utc).toJSDate(),
		priceArea: price_area === 'DK2' ? 'DK2' : 'DK1',
		priceDKK: price_dkk
	}));

	return { success: true, data: spotData };
};
