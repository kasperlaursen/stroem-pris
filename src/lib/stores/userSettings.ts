import type { PriceAreas } from '$lib/data/spot/energidataservice/types';
import { priceAreas } from '$lib/data/spot/energidataservice/types';
import { writable } from 'svelte/store';

/** UserSettings interface representing user's preferences. */
export interface UserSettings {
	/** The user's preferred price area. */
	preferredPriceArea: PriceAreas;

	/** Whether to include VAT in the price. */
	includeVat: boolean;

	/** Whether to include fees in the price. */
	includeFees: boolean;

	/** Whether to include tariff in the price. */
	includeTariff: boolean;
}

// Default user settings.
const defaultUserSettings: UserSettings = {
	preferredPriceArea: 'DK1',
	includeVat: true,
	includeFees: true,
	includeTariff: true
};

const STORAGE_KEY = 'userSettings';

const storedUserSettings = localStorage.getItem(STORAGE_KEY);
const parsedUserSettings = storedUserSettings && JSON.parse(storedUserSettings);
const validUserSettings = validateUserSettings(parsedUserSettings);

export const userSettings = writable<UserSettings>(validUserSettings || defaultUserSettings);
userSettings.subscribe((value) => localStorage.setItem(STORAGE_KEY, JSON.stringify(value)));

/**
 * Validates the user settings object and returns a valid UserSettings object.
 * If the input is not valid, the default user settings are returned.
 *
 * @param {unknown} userSettings - The user settings object to validate.
 * @returns {UserSettings} - A valid UserSettings object.
 */
function validateUserSettings(userSettings: unknown): UserSettings {
    
	if (typeof userSettings !== 'object' || userSettings === null) {
		return defaultUserSettings;
	}

	const settings = userSettings as Partial<UserSettings>;

	if (
		!settings.preferredPriceArea ||
		!priceAreas.includes(settings.preferredPriceArea) ||
		typeof settings.includeVat !== 'boolean' ||
		typeof settings.includeFees !== 'boolean' ||
		typeof settings.includeTariff !== 'boolean'
	) {
		return defaultUserSettings;
	}

	return {
		preferredPriceArea: settings.preferredPriceArea,
		includeVat: settings.includeVat,
		includeFees: settings.includeFees,
		includeTariff: settings.includeTariff
	};
}
