import type { FeeKey } from '$lib/data/fees/getFees';
import type { UserSettings } from '$lib/stores/userSettingsStore';

export interface UserSettingsToFeesKeyListParams {
	settings: UserSettings;
}

/**
 * Generates a list of FeeKeys based on the user settings.
 *
 * @param {UserSettingsToFeesKeyListParams} params - The user settings.
 * @returns {FeeKey[]} An array of FeeKeys according to the user settings.
 */
export const userSettingsToFeesKeyList = ({
	settings
}: UserSettingsToFeesKeyListParams): FeeKey[] => {
	const { includeFees, includeTariff } = settings;
	const feeKeys: FeeKey[] = [];

	if (includeFees) {
		feeKeys.push('elafgift');
	}

	if (includeTariff) {
		feeKeys.push('systemtarif', 'transmissionstarif');
	}

	return feeKeys;
};
