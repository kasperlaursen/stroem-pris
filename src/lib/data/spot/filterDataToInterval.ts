import { DateTime, Interval } from 'luxon';

interface DataWithHourUTC {
	hourUTC: Date;
}

interface filterDataToIntervalParams<DataType extends DataWithHourUTC> {
	from: DateTime;
	to: DateTime;
	data: DataType[];
}

/**
 * Filters a list of Data to only contain data within the from and to date.
 */
export const filterDataToInterval = <DataType extends DataWithHourUTC>({
	from,
	to,
	data
}: filterDataToIntervalParams<DataType>) => {
	const requestedInterval = Interval.fromDateTimes(from, to);
	const requestedDatapoints = data.filter(({ hourUTC }) =>
		requestedInterval.contains(DateTime.fromJSDate(hourUTC))
	);
	return requestedDatapoints;
};
