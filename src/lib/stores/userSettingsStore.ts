import { browser } from '$app/environment';
import { netCompaniesArray, type NetCompany } from '$lib/data/fees/types';
import type { PriceAreas } from '$lib/data/spot/energidataservice/types';
import { priceAreas } from '$lib/data/spot/energidataservice/types';
import { writable } from 'svelte/store';

/** UserSettings interface representing user's preferences. */
export interface UserSettings {
	/** The user's preferred price area. */
	preferredPriceArea: PriceAreas;
	/**
	 * The user's selected Net Company.
	 * This is used to calculate the net tariff.
	 */
	netCompany?: NetCompany;
	/** Whether to include VAT (Moms) in the price. */
	includeVat: boolean;
	/** Whether to include Tax (Elafgift) in the price. */
	includeTax: boolean;
	/** Whether to include Tariff (NetTarif) in the price. */
	includeTariff: boolean;
	/** Whether to include Fees (TRANSMISSIONSNETTARIF & SYSTEMTARIF) in the price. */
	includeFees: boolean;
}

// Default user settings.
const defaultUserSettings: UserSettings = {
	preferredPriceArea: 'DK1',
	netCompany: 'elinord',
	includeVat: true,
	includeTax: true,
	includeTariff: true,
	includeFees: true
};

const STORAGE_KEY = 'userSettings';
let validUserSettings;

if (browser) {
	const storedUserSettings = localStorage.getItem(STORAGE_KEY);
	const parsedUserSettings = storedUserSettings && JSON.parse(storedUserSettings);
	validUserSettings = validateUserSettings(parsedUserSettings);
}

export const userSettings = writable<UserSettings>(validUserSettings || defaultUserSettings);

if (browser) {
	userSettings.subscribe((value) => localStorage.setItem(STORAGE_KEY, JSON.stringify(value)));
}

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
		!settings.netCompany ||
		!netCompaniesArray.includes(settings.netCompany) ||
		typeof settings.includeVat !== 'boolean' ||
		typeof settings.includeTax !== 'boolean' ||
		typeof settings.includeTariff !== 'boolean' ||
		typeof settings.includeFees !== 'boolean'
	) {
		return defaultUserSettings;
	}

	return {
		preferredPriceArea: settings.preferredPriceArea,
		includeVat: settings.includeVat,
		includeFees: settings.includeFees,
		includeTariff: settings.includeTariff,
		netCompany: settings.netCompany,
		includeTax: settings.includeTax
	};
}
