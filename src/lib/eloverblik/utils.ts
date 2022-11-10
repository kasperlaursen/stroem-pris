import { DateTime } from 'luxon';
import type { Result } from './types';

interface MeterTableData {
	hour_utc: string;
	meter_id: string;
	measurement: number;
}

export const convertResponseToMeterTableData = (apiResponse: Result[]): MeterTableData[] => {
	const meterData: MeterTableData[] = [];
	apiResponse.forEach(({ MyEnergyData_MarketDocument, id: meteringPoint }) => {
		MyEnergyData_MarketDocument.TimeSeries[0].Period.forEach(({ timeInterval, Point }) => {
			Point.forEach(({ 'out_Quantity.quantity': measurement }, index) => {
				meterData.push({
					hour_utc: DateTime.fromISO(timeInterval.start).plus({ hours: index }).toUTC().toISO(),
					meter_id: meteringPoint,
					measurement: Number(measurement)
				});
			});
		});
	});
	return meterData;
};
