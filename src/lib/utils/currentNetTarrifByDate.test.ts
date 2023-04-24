// currentNetTarrifByDate.spec.ts
import { describe, it, expect } from 'vitest';
import { DateTime } from 'luxon';
import { priceAreas } from '$lib/data/spot/energidataservice/types';
import type { UserSettings } from '$lib/stores/userSettingsStore';
import { currentNetTarrifByDate } from './currentNetTarrifByDate';
import type { NettariffsData } from '$lib/data/fees/getNettarrifs';

const exampleNetTarifData: NettariffsData[] = [
	{
		value: 100,
		fromDate: '2022-01-10T00:00:00.000Z',
		hourOfDay: 0
	},
	{
		value: 200,
		fromDate: '2022-02-01T00:00:00.000Z',
		hourOfDay: 2
	}
];

const exampleUserSettings: UserSettings = {
	preferredPriceArea: priceAreas[0],
	netCompany: 'elinord',
	includeVat: true,
	includeFees: true,
	includeTariff: true,
	includeTax: true
};

describe('currentNetTarrifByDate', () => {
	it('returns 0 when includeNetTariff is false', () => {
		const result = currentNetTarrifByDate({
			netTarifData: exampleNetTarifData,
			settings: { ...exampleUserSettings, includeTariff: false },
			dateTime: DateTime.fromISO('2022-02-01T00:00:00.000Z')
		});
		expect(result).toEqual(0);
	});

	it('returns 0 when netTarifData is undefined or empty', () => {
		const result = currentNetTarrifByDate({
			netTarifData: undefined,
			settings: exampleUserSettings,
			dateTime: DateTime.fromISO('2022-02-01T00:00:00.000Z')
		});
		expect(result).toEqual(0);
	});

	it('returns 0 when no relevant net tariffs are found', () => {
		const result = currentNetTarrifByDate({
			netTarifData: exampleNetTarifData,
			settings: exampleUserSettings,
			dateTime: DateTime.fromISO('2022-01-01T01:00:00.000Z')
		});
		expect(result).toEqual(0);
	});

	it('returns the most recent tariff value for the given date and time', () => {
		const result = currentNetTarrifByDate({
			netTarifData: exampleNetTarifData,
			settings: exampleUserSettings,
			dateTime: DateTime.fromISO('2022-02-02T01:00:00.000Z')
		});
		expect(result).toEqual(200);
	});
});
