import { describe, it, expect } from 'vitest';
import { userSettingsToFeesKeyList } from './userSettingsToFeesKeyList';
import type { UserSettings } from '$lib/stores/userSettingsStore';

describe('userSettingsToFeesKeyList', () => {
	it('returns an empty array if both includeFees and includeTariff are false', async () => {
		const settings: UserSettings = {
			preferredPriceArea: 'DK1',
			includeVat: true,
			includeFees: false,
			includeTariff: false
		};
		const result = userSettingsToFeesKeyList({ settings });

		expect(result).toEqual([]);
	});

	it('returns an array with only elafgift if includeFees is true and includeTariff is false', async () => {
		const settings: UserSettings = {
			preferredPriceArea: 'DK1',
			includeVat: true,
			includeFees: true,
			includeTariff: false
		};
		const result = userSettingsToFeesKeyList({ settings });

		expect(result).toEqual(['elafgift']);
	});

	it('returns an array with balancetarif and systemtarif if includeFees is false and includeTariff is true', async () => {
		const settings: UserSettings = {
			preferredPriceArea: 'DK1',
			includeVat: true,
			includeFees: false,
			includeTariff: true
		};
		const result = userSettingsToFeesKeyList({ settings });

		expect(result).toEqual(['balancetarif', 'systemtarif']);
	});

	it('returns an array with elafgift, balancetarif, and systemtarif if both includeFees and includeTariff are true', async () => {
		const settings: UserSettings = {
			preferredPriceArea: 'DK1',
			includeVat: true,
			includeFees: true,
			includeTariff: true
		};
		const result = userSettingsToFeesKeyList({ settings });

		expect(result).toEqual(['elafgift', 'balancetarif', 'systemtarif']);
	});
});
