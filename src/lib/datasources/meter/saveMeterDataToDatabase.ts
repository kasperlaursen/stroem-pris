import type { Session } from '@supabase/supabase-js';
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import type { MeterTableData } from '$lib/eloverblik/utils';
import type { InternalApiResponse } from '$lib/types/api';

interface Params {
	supabaseClient: TypedSupabaseClient;
	session: Session;
	newMeterData: MeterTableData[];
}

export const saveMeterDataToDatabase: (
	params: Params
) => Promise<InternalApiResponse<MeterTableData[]>> = async ({
	newMeterData,
	session,
	supabaseClient
}) => {
	if (!newMeterData || !newMeterData.length) {
		return { success: true, data: [] };
	}

	console.log('📊 🗄 ', `Saving data to database`);

	const { data: insertedData, error: dbError } = await supabaseClient
		.from('meter_data')
		.insert(
			newMeterData.map((meterDataPoint) => ({
				user_id: session.user.id,
				...meterDataPoint
			}))
		)
		.select('measurement, meter_id, hour_utc');

	if (dbError) {
		return { success: false, error: { code: dbError.code, message: dbError.message } };
	}

	return { success: true, data: insertedData ?? [] };
};
