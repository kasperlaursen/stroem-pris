import { DateTime, Interval } from 'luxon';

interface DataWithHourUTC {
	hourUTC: Date;
}

interface FilterSpotDataToIntervalParams<DataType extends DataWithHourUTC> {
	from: DateTime;
	to: DateTime;
	data: DataType[];
}

export const filterSpotDataToInterval = <DataType extends DataWithHourUTC>({
	from,
	to,
	data
}: FilterSpotDataToIntervalParams<DataType>) => {
	const requestedInterval = Interval.fromDateTimes(from, to);
	const requestedDatapoints = data.filter(({ hourUTC }) =>
		requestedInterval.contains(DateTime.fromJSDate(hourUTC))
	);
	return requestedDatapoints;
};
