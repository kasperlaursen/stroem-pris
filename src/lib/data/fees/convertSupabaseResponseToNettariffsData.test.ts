import { describe, it, expect } from 'vitest';
import {
	convertSupabaseResponseToNettariffsData,
	validateNumberAsHourOfDay
} from './convertSupabaseResponseToNettariffsData';

describe('convertSupabaseResponseToNettariffsData', () => {
	it('returns the correct NettariffsData array from given Supabase data', () => {
		const data = [
			{ from_date: '2023-01-01', hour_of_day: 1, value: 10 },
			{ from_date: '2023-01-02', hour_of_day: 2, value: 20 }
		];

		const expected = [
			{ fromDate: '2023-01-01', hourOfDay: 1, value: 10 },
			{ fromDate: '2023-01-02', hourOfDay: 2, value: 20 }
		];

		const result = convertSupabaseResponseToNettariffsData(data);
		expect(result).toEqual(expected);
	});

	it('throws an error for invalid Supabase date', () => {
		const invalidData = [
			{ from_date: 'invalid', hour_of_day: 1, value: 10 },
			{ from_date: '2023-01-02', hour_of_day: 25, value: 20 }
		];

		expect(() => convertSupabaseResponseToNettariffsData(invalidData)).toThrow(
			'Failed to convert date to ISO string!'
		);
	});

	it('throws an error for invalid Supabase data', () => {
		const invalidData = [
			{ from_date: '2023-01-02', hour_of_day: null, value: 10 },
			{ from_date: '2023-01-02', hour_of_day: 25, value: 20 }
		];

		expect(() => convertSupabaseResponseToNettariffsData(invalidData)).toThrow(
			'Invalid data returned from nettariff table!'
		);
	});

	it('returns an empty array for empty or null input data', () => {
		const emptyData: { from_date: unknown; hour_of_day: unknown; value: unknown }[] = [];
		const resultForEmptyData = convertSupabaseResponseToNettariffsData(emptyData);
		expect(resultForEmptyData).toEqual([]);

		const nullData = null as unknown as {
			from_date: unknown;
			hour_of_day: unknown;
			value: unknown;
		}[];
		const resultForNullData = convertSupabaseResponseToNettariffsData(nullData);
		expect(resultForNullData).toEqual([]);
	});
});

describe('validateNumberAsHourOfDay', () => {
	it('returns true for valid hour of day', () => {
		const validHours = [0, 12, 23];
		validHours.forEach((hour) => {
			const result = validateNumberAsHourOfDay(hour);
			expect(result).toBe(true);
		});
	});

	it('returns false for invalid hour of day', () => {
		const invalidHours = [-1, 24, 25];
		invalidHours.forEach((hour) => {
			const result = validateNumberAsHourOfDay(hour);
			expect(result).toBe(false);
		});
	});
});
