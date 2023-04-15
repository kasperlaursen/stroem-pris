import { describe, it, expect } from 'vitest';
import { currentFeesByDateAndKey, singleFeeByDateAndKey } from './currentFeesByDateAndKey';
import { DateTime } from 'luxon';
import type { FeeKey, FeesData } from '$lib/data/fees/getFees';
import type { UserSettings } from '$lib/stores/userSettingsStore';

const feesData: FeesData[] = [
	{ from: '2022-01-01T00:00:00.000Z', key: 'balancetarif', value: 10 },
	{ from: '2022-01-20T00:00:00.000Z', key: 'balancetarif', value: 14 },
	{ from: '2022-02-01T00:00:00.000Z', key: 'elafgift', value: 20 },
	{ from: '2022-01-01T00:00:00.000Z', key: 'systemtarif', value: 5 },
	{ from: '2022-01-15T00:00:00.000Z', key: 'systemtarif', value: 5 },
	{ from: '2022-02-15T00:00:00.000Z', key: 'transmissionstarif', value: 15 }
];

const defaultSettings: UserSettings = {
	includeVat: false,
	preferredPriceArea: "DK1",
	includeFees: false,
	includeTariff: false,
};

describe('currentFeesByDateAndKey', () => {
	it('returns the sum of tarrifs for a given date if includeTariff is enabled', async () => {
		const date = DateTime.fromISO('2022-01-10T00:00:00.000Z', { zone: 'utc' });
		const settings: UserSettings = {
			...defaultSettings,
			includeTariff: true,
		};
		const result = currentFeesByDateAndKey({ feesData, settings, date });

		expect(result).toEqual(15);
	});

	it('returns 0 if all fees are disabled', async () => {
		const date = DateTime.fromISO('2022-01-10T00:00:00.000Z', { zone: 'utc' });
		const settings: UserSettings = {
			...defaultSettings,
		};
		const result = currentFeesByDateAndKey({ feesData, settings, date });

		expect(result).toEqual(0);
	});

	it('returns the sum of all enabled fees if all fees are enabled but only if date is not in the future', async () => {
		const date = DateTime.fromISO('2022-01-20T00:00:00.000Z', { zone: 'utc' });
		const settings: UserSettings = {
			...defaultSettings,
			includeFees: true,
			includeTariff: true,
		};
		const result = currentFeesByDateAndKey({ feesData, settings, date });

		expect(result).toEqual(19);
	});

	it('returns the sum of all enabled fees if all fees are enabled', async () => {
		const date = DateTime.fromISO('2022-02-21T00:00:00.000Z', { zone: 'utc' });
		const settings: UserSettings = {
			...defaultSettings,
			includeFees: true,
			includeTariff: true,
		};
		const result = currentFeesByDateAndKey({ feesData, settings, date });

		expect(result).toEqual(54);
	});
});

describe('singleFeeByDateAndKey', () => {
	it('returns correct fee value for given date and key', async () => {
		const date = DateTime.fromISO('2022-01-10T00:00:00.000Z', { zone: 'utc' });
		const feeKey: FeeKey = 'balancetarif';
		const result = singleFeeByDateAndKey({ feesData, feeKey, date });

		expect(result).toEqual(10);
	});

	it('returns correct fee value for given date and key', async () => {
		const date = DateTime.fromISO('2022-01-20T00:00:00.000Z', { zone: 'utc' });
		const feeKey: FeeKey = 'balancetarif';
		const result = singleFeeByDateAndKey({ feesData, feeKey, date });

		expect(result).toEqual(14);
	});

	it('returns 0 if no matching fees found', async () => {
		const date = DateTime.fromISO('2021-12-01T00:00:00.000Z', { zone: 'utc' });
		const feeKey: FeeKey = 'balancetarif';
		const result = singleFeeByDateAndKey({ feesData, feeKey, date });

		expect(result).toEqual(0);
	});
});
