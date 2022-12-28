import type { DateTime } from 'luxon';

export type Colors = 'green' | 'yellow' | 'red' | 'neutral';
export type RowState = 'inactive' | 'active' | 'none';

export interface SpotChartData {
	max: number;
	average: number;
	entries: SpotChartDataEntry[];
}

export interface SpotChartDataEntry {
	price: number;
	time: DateTime;
}
