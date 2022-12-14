import type { MeterTableData } from '$lib/eloverblik/utils';
import type { InternalApiResponse } from '$lib/types/api';
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import type { DateTime } from 'luxon';

export type MeterData = MeterTableData[] | null;

interface Params {
	meterId: string;
	fromDate: DateTime;
	toDate: DateTime;
	supabaseClient: TypedSupabaseClient;
	expecedDatapoints: number;
}

export const getMeterDataFromDatabase = async ({
	meterId,
	fromDate,
	toDate,
	supabaseClient,
	expecedDatapoints
}: Params): Promise<InternalApiResponse<MeterData>> => {
	const { data } = await supabaseClient
		.from('meter_data')
		.select('measurement, meter_id, hour_utc')
		.eq('meter_id', meterId)
		.gte('hour_utc', fromDate.toUTC())
		.lt('hour_utc', toDate.toUTC());

	console.log(
		'📊 🗄 ',
		`Got ${data?.length} data point from Database, expected ${expecedDatapoints}`
	);

	if (data && data?.length > expecedDatapoints) {
		return {
			success: false,
			error: { code: 500, message: '😱 Found more data point than expected' }
		};
	}

	return { success: true, data };
};
