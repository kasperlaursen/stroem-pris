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

		expect(result.fullHourDiff).toEqual(24);
	});

	it('returns two days for hours overlapping two dates (DK winter time)', () => {
		const from = DateTime.fromISO('2022-01-02T23:00:00.000Z', { zone: 'UTC' });
		const to = DateTime.fromISO('2022-01-03T01:00:00.000Z', { zone: 'UTC' });
		const result = convertDatesToFullDays({
			from,
			to
		});

		const expected: ReturnType<typeof convertDatesToFullDays> = {
			fullDayFrom: DateTime.fromISO('2022-01-02T00:00:00.000+01:00', { zone: 'Europe/Copenhagen' }),
			fullDayFromUTC: DateTime.fromISO('2022-01-01T23:00:00.000Z', { zone: 'UTC' }),
			fullDayTo: DateTime.fromISO('2022-01-04T00:00:00.000+01:00', { zone: 'Europe/Copenhagen' }),
			fullDayToUTC: DateTime.fromISO('2022-01-03T23:00:00.000Z', { zone: 'UTC' }),
			fullHourDiff: 48
		};

		expect(result).toEqual(expected);
	});

	it('returns correct days over month change (DK winter time)', () => {
		const from = DateTime.fromISO('2022-01-31T23:00:00.000Z', { zone: 'UTC' });
		const to = DateTime.fromISO('2022-02-01T01:00:00.000Z', { zone: 'UTC' });
		const result = convertDatesToFullDays({
			from,
			to
		});

		const expected: ReturnType<typeof convertDatesToFullDays> = {
			fullDayFrom: DateTime.fromISO('2022-01-31T00:00:00.000+01:00', { zone: 'Europe/Copenhagen' }),
			fullDayFromUTC: DateTime.fromISO('2022-01-30T23:00:00.000Z', { zone: 'UTC' }),
			fullDayTo: DateTime.fromISO('2022-02-02T00:00:00.000+01:00', { zone: 'Europe/Copenhagen' }),
			fullDayToUTC: DateTime.fromISO('2022-02-01T23:00:00.000Z', { zone: 'UTC' }),
			fullHourDiff: 48
		};

		expect(result).toEqual(expected);
	});

	it('returns two days for hours overlapping two dates (DK summer time)', () => {
		const from = DateTime.fromISO('2022-05-02T23:00:00.000Z', { zone: 'UTC' });
		const to = DateTime.fromISO('2022-05-03T01:00:00.000Z', { zone: 'UTC' });
		const result = convertDatesToFullDays({
			from,
			to
		});

		const expected: ReturnType<typeof convertDatesToFullDays> = {
			fullDayFrom: DateTime.fromISO('2022-05-02T00:00:00.000+02:00', { zone: 'Europe/Copenhagen' }),
			fullDayFromUTC: DateTime.fromISO('2022-05-01T22:00:00.000Z', { zone: 'UTC' }),
			fullDayTo: DateTime.fromISO('2022-05-04T00:00:00.000+02:00', { zone: 'Europe/Copenhagen' }),
			fullDayToUTC: DateTime.fromISO('2022-05-03T22:00:00.000Z', { zone: 'UTC' }),
			fullHourDiff: 48
		};

		expect(result).toEqual(expected);
	});

	it('returns correct days over month change (DK summer time)', () => {
		const from = DateTime.fromISO('2022-05-31T23:00:00.000Z', { zone: 'UTC' });
		const to = DateTime.fromISO('2022-06-01T01:00:00.000Z', { zone: 'UTC' });
		const result = convertDatesToFullDays({
			from,
			to
		});

		const expected: ReturnType<typeof convertDatesToFullDays> = {
			fullDayFrom: DateTime.fromISO('2022-05-31T00:00:00.000+02:00', { zone: 'Europe/Copenhagen' }),
			fullDayFromUTC: DateTime.fromISO('2022-05-30T22:00:00.000Z', { zone: 'UTC' }),
			fullDayTo: DateTime.fromISO('2022-06-02T00:00:00.000+02:00', { zone: 'Europe/Copenhagen' }),
			fullDayToUTC: DateTime.fromISO('2022-06-01T22:00:00.000Z', { zone: 'UTC' }),
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
			fullDayFrom: DateTime.fromISO('2021-12-31T00:00:00.000+01:00', { zone: 'Europe/Copenhagen' }),
			fullDayFromUTC: DateTime.fromISO('2021-12-30T23:00:00.000Z', { zone: 'UTC' }),
			fullDayTo: DateTime.fromISO('2022-01-02T00:00:00.000+01:00', { zone: 'Europe/Copenhagen' }),
			fullDayToUTC: DateTime.fromISO('2022-01-01T23:00:00.000Z', { zone: 'UTC' }),
			fullHourDiff: 48
		};

		expect(result).toEqual(expected);
	});

	it('returns correct days over winter time -> summer time change', () => {
		const from = DateTime.fromISO('2023-03-25T23:00:00.000Z', { zone: 'UTC' });
		const to = DateTime.fromISO('2023-03-26T01:00:00.000Z', { zone: 'UTC' });
		const result = convertDatesToFullDays({
			from,
			to
		});

		const expected: ReturnType<typeof convertDatesToFullDays> = {
			fullDayFrom: DateTime.fromISO('2023-03-25T00:00:00.000+01:00', { zone: 'Europe/Copenhagen' }),
			fullDayFromUTC: DateTime.fromISO('2023-03-24T23:00:00.000Z', { zone: 'UTC' }),
			fullDayTo: DateTime.fromISO('2023-03-27T00:00:00.000+02:00', { zone: 'Europe/Copenhagen' }),
			fullDayToUTC: DateTime.fromISO('2023-03-26T22:00:00.000Z', { zone: 'UTC' }),
			fullHourDiff: 47
		};

		expect(result).toEqual(expected);
	});

	it('returns correct days over summer time -> winter time change', () => {
		const from = DateTime.fromISO('2023-10-28T23:00:00.000Z', { zone: 'UTC' });
		const to = DateTime.fromISO('2023-10-29T01:00:00.000Z', { zone: 'UTC' });
		const result = convertDatesToFullDays({
			from,
			to
		});

		const expected: ReturnType<typeof convertDatesToFullDays> = {
			fullDayFrom: DateTime.fromISO('2023-10-28T00:00:00.000+02:00', { zone: 'Europe/Copenhagen' }),
			fullDayFromUTC: DateTime.fromISO('2023-10-27T22:00:00.000Z', { zone: 'UTC' }),
			fullDayTo: DateTime.fromISO('2023-10-30T00:00:00.000+01:00', { zone: 'Europe/Copenhagen' }),
			fullDayToUTC: DateTime.fromISO('2023-10-29T23:00:00.000Z', { zone: 'UTC' }),
			fullHourDiff: 49
		};

		expect(result).toEqual(expected);
	});
});
