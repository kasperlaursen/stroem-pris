import { describe, it, expect } from 'vitest';
import { userSettingsToFeesKeyList } from './userSettingsToFeesKeyList';
import type { UserSettings } from '$lib/stores/userSettingsStore';

describe('userSettingsToFeesKeyList', () => {
	it('returns an empty array if both includeFees and includeTax are false', async () => {
		const settings: UserSettings = {
			preferredPriceArea: 'DK1',
			includeVat: false,
			includeTax: false,
			includeFees: false,
			includeTariff: false
		};
		const result = userSettingsToFeesKeyList({ settings });

		expect(result).toEqual([]);
	});

	it('returns an array with only elafgift if includeTax is true', async () => {
		const settings: UserSettings = {
			preferredPriceArea: 'DK1',
			includeVat: false,
			includeTax: true,
			includeFees: false,
			includeTariff: false
		};
		const result = userSettingsToFeesKeyList({ settings });

		expect(result).toEqual(['elafgift']);
	});

	it('returns an array with transmissionstarif and systemtarif if includeFees is true', async () => {
		const settings: UserSettings = {
			preferredPriceArea: 'DK1',
			includeVat: false,
			includeTax: false,
			includeFees: true,
			includeTariff: false
		};
		const result = userSettingsToFeesKeyList({ settings });

		expect(result).toContain('transmissionstarif');
		expect(result).toContain('systemtarif');
	});

	it('returns an array with elafgift, balancetarif, and systemtarif if both includeFees and includeTax are true', async () => {
		const settings: UserSettings = {
			preferredPriceArea: 'DK1',
			includeVat: false,
			includeTax: true,
			includeFees: true,
			includeTariff: false
		};
		const result = userSettingsToFeesKeyList({ settings });

		expect(result).toContain('elafgift');
		expect(result).toContain('transmissionstarif');
		expect(result).toContain('systemtarif');
	});
});
