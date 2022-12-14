import type { MeterTableData } from '$lib/eloverblik/utils';
import { DateTime } from 'luxon/src/datetime';

interface Params {
	oldMeterData?: MeterTableData[] | null;
	newMeterData: MeterTableData[];
}

export const removeExistingMeterData: (params: Params) => MeterTableData[] = ({
	newMeterData,
	oldMeterData
}) => {
	if (!oldMeterData) {
		return newMeterData;
	}

	const filteredMeterData = newMeterData.filter(
		(newDataPoint) =>
			!oldMeterData.some((oldDataPoint) => compareMeterDataEntry(oldDataPoint, newDataPoint))
	);
	return filteredMeterData;
};

const compareMeterDataEntry = (
	oldDataPoint: MeterTableData,
	newDataPoint: MeterTableData
): boolean => {
	const { meter_id: oldMeterId, hour_utc: oldHourUTC } = oldDataPoint;
	const { meter_id: newMeterId, hour_utc: newHourUTC } = newDataPoint;

	if (oldMeterId !== newMeterId) {
		return false;
	}

	const oldHourAsMills = ISOHourUTCToMills(oldHourUTC);
	const newHourAsMills = ISOHourUTCToMills(newHourUTC);

	const isSameTimeSlot = oldHourAsMills === newHourAsMills;
	return isSameTimeSlot;
};

const ISOHourUTCToMills = (dateISO: string) =>
	DateTime.fromISO(dateISO, { zone: 'utc' }).toMillis();
