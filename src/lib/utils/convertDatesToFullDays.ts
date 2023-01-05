import { DateTime } from 'luxon';

export interface ConvertDatesToFullDaysParams {
	/** The first date to get data points from. (Danish time) */
	from: DateTime;
	/** The last data point will be the last hour of the day before this date. (Danish time) */
	to: DateTime;
}

/**
 * Converts the given DateTimes to full days needed to get the requested data.
 * This is nessecary when an api only
 */
export const convertDatesToFullDays = ({ from, to }: ConvertDatesToFullDaysParams) => {
	const fullDayFrom = DateTime.fromObject({ year: from.year, month: from.month, day: from.day });

	const nextToDay = to.hour > 0 ? to.plus({ days: 1 }) : to;
	const fullDayTo = DateTime.fromObject({
		year: nextToDay.year,
		month: nextToDay.month,
		day: nextToDay.day
	});

	const fullHourDiff = fullDayTo.diff(fullDayFrom, 'hours').toObject().hours;

	return { fullDayFrom, fullDayTo, fullHourDiff };
};
