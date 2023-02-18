import type { SpotChartDataEntry } from '$lib/components/Charts/SpotChart/types';
import type { SpotData } from '$lib/data/spot/types';
import { DateTime } from 'luxon';
import { PRICE_MULTIPLIER } from './constants';

interface Params {
	spotData: SpotData[];
	order?: 'ASC' | 'DESC';
}

export const spotDataToSpotChartEntries = ({
	spotData,
	order = 'ASC'
}: Params): SpotChartDataEntry[] => {
	return spotData
		.map(({ hourUTC, priceDKK }) => ({
			price: priceDKK * PRICE_MULTIPLIER,
			time: DateTime.fromJSDate(hourUTC).setZone('Europe/Copenhagen')
		}))
		.sort((a, b) => (order === 'DESC' ? sortASC(a, b) : sortDESC(a, b)));
};

const sortASC = (
	{ time: timeA }: SpotChartDataEntry,
	{ time: timeB }: SpotChartDataEntry
): number => timeA.toMillis() - timeB.toMillis();

const sortDESC = (
	{ time: timeA }: SpotChartDataEntry,
	{ time: timeB }: SpotChartDataEntry
): number => timeB.toMillis() - timeA.toMillis();
