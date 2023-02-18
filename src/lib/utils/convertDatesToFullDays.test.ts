import { DateTime } from 'luxon';
import { describe, it, expect } from 'vitest';
import { convertDatesToFullDays } from './convertDatesToFullDays';

describe('convertDatesToFullDays', () => {
	it('returns 24 hours for 1 hour interval same day', () => {
		const from = DateTime.fromISO('2022-01-01T01:00:00.000Z', { zone: 'UTC' });
		const to = DateTime.fromISO('2022-01-01T02:00:00.000Z', { zone: 'UTC' });
		const result = convertDatesToFullDays({
			from,
			to
		});

		const expected: ReturnType<typeof convertDatesToFullDays> = {
			fullDayFrom: DateTime.fromISO('2022-01-01T00:00:00.000Z', { zone: 'UTC' }),
			fullDayTo: DateTime.fromISO('2022-01-02T00:00:00.000Z', { zone: 'UTC' }),
			fullHourDiff: 24
		};

		expect(result).toEqual(expected);
	});

	it('returns two days for hours overlapping two dates', () => {
		const from = DateTime.fromISO('2022-01-02T23:00:00.000Z', { zone: 'UTC' });
		const to = DateTime.fromISO('2022-01-03T01:00:00.000Z', { zone: 'UTC' });
		const result = convertDatesToFullDays({
			from,
			to
		});

		const expected: ReturnType<typeof convertDatesToFullDays> = {
			fullDayFrom: DateTime.fromISO('2022-01-02T00:00:00.000Z', { zone: 'UTC' }),
			fullDayTo: DateTime.fromISO('2022-01-04T00:00:00.000Z', { zone: 'UTC' }),
			fullHourDiff: 48
		};

		expect(result).toEqual(expected);
	});

	it('returns correct days over month change', () => {
		const from = DateTime.fromISO('2022-01-31T23:00:00.000Z', { zone: 'UTC' });
		const to = DateTime.fromISO('2022-02-01T01:00:00.000Z', { zone: 'UTC' });
		const result = convertDatesToFullDays({
			from,
			to
		});

		const expected: ReturnType<typeof convertDatesToFullDays> = {
			fullDayFrom: DateTime.fromISO('2022-01-31T00:00:00.000Z', { zone: 'UTC' }),
			fullDayTo: DateTime.fromISO('2022-02-02T00:00:00.000Z', { zone: 'UTC' }),
			fullHourDiff: 48
		};

		expect(result).toEqual(expected);
	});

	it('returns correct days over year change', () => {
		const from = DateTime.fromISO('2021-12-31T23:00:00.000Z', { zone: 'UTC' });
		const to = DateTime.fromISO('2022-01-01T01:00:00.000Z', { zone: 'UTC' });
		const result = convertDatesToFullDays({
			from,
			to
		});

		const expected: ReturnType<typeof convertDatesToFullDays> = {
			fullDayFrom: DateTime.fromISO('2021-12-31T00:00:00.000Z', { zone: 'UTC' }),
			fullDayTo: DateTime.fromISO('2022-01-02T00:00:00.000Z', { zone: 'UTC' }),
			fullHourDiff: 48
		};

		expect(result).toEqual(expected);
	});
});
