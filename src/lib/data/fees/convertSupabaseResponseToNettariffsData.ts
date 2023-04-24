import { DateTime } from 'luxon';
import type { NettariffsData } from './getNettarrifs';
import { type HourOfDay, hourOfDayArray } from './types';

/**
 * Converts the response from the Supabase database to a NettariffsData array.
 */
export const convertSupabaseResponseToNettariffsData = (
	data: {
		from_date: unknown;
		hour_of_day: unknown;
		value: unknown;
	}[]
): NettariffsData[] => {
	if (!data) return [];
	if (data.length === 0) return [];

	const convertedData = data.map(({ from_date, hour_of_day, value }) => {
		if (
			!from_date ||
			!value ||
			typeof from_date !== 'string' ||
			typeof hour_of_day !== 'number' ||
			typeof value !== 'number' ||
			!validateNumberAsHourOfDay(hour_of_day)
		) {
			throw new Error('Invalid data returned from nettariff table!');
		}

		const fromDataAsISO = DateTime.fromISO(from_date).toISODate();
		if (!fromDataAsISO) {
			throw new Error('Failed to convert date to ISO string!');
		}

		return {
			fromDate: fromDataAsISO,
			value: value,
			hourOfDay: hour_of_day
		};
	});

	return convertedData;
};

/** Validates that a number is within the range of HourOfDay */
export const validateNumberAsHourOfDay = (value: number): value is HourOfDay => {
	return hourOfDayArray.includes(value as HourOfDay);
};
