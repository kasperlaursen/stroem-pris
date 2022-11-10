import type { PriceAreas } from './../lib/energidataservice/types';
import type { InternalError } from '$lib/types/api';

import { DateTime } from 'luxon';
import type { PageLoad } from './$types';
import type { FeeKeys } from '$lib/types/fees';
import type { InternalApiResponse } from '$lib/types/api';

export const load: PageLoad = async ({ fetch, url }) => {
	const errors: InternalError[] = [];

	const priceArea = url.searchParams.get('area') == 'DK2' ? 'DK2' : 'DK1';

	const month = url.searchParams.get('month')
		? Number(url.searchParams.get('month'))
		: DateTime.now().month;
	const monthFrom = DateTime.fromObject({ day: 1, month, year: DateTime.now().year }).toISODate();
	const monthTo = DateTime.fromObject({
		day: 1,
		month: month + 1,
		year: DateTime.now().year
	}).toISODate();

	const usageMeterResponse = await fetch(`/api/meter/?from=${monthFrom}&to=${monthTo}`);
	const usageMeterData = (await usageMeterResponse.json()) as InternalApiResponse<
		{
			hour_utc: string;
			meter_id: string;
			measurement: number;
		}[]
	>;

	if (!usageMeterData.success) {
		errors.push({ message: 'No data usage was returned' });
	}

	return { errors, usageMeterData: usageMeterData.success === true ? usageMeterData.data : [] };
};
