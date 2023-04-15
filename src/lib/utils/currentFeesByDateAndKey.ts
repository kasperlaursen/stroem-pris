import type { FeeKey, FeesData } from '$lib/data/fees/getFees';
import type { UserSettings } from '$lib/stores/userSettingsStore';
import { DateTime } from 'luxon';
import { userSettingsToFeesKeyList } from './userSettingsToFeesKeyList';

interface CommonParams {
	feesData: FeesData[];
	date: DateTime;
}

export interface CurrentFeesByDateAndKeyParams extends CommonParams {
	settings: UserSettings;
}

/**
 * Calculates the sum of all enabled fees for a given date.
 *
 * @param {CurrentFeesByDateAndKeyParams} params - Parameters for calculating the sum of all enabled fees
 * @returns {number} Sum of all enabled fees for the given date
 */
export const currentFeesByDateAndKey = ({
	feesData,
	settings,
	date
}: CurrentFeesByDateAndKeyParams): number => {
	const feeKeys = userSettingsToFeesKeyList({ settings });
	const allFees = feeKeys.map((key) => singleFeeByDateAndKey({ feesData, feeKey: key, date }));
	return allFees.reduce((prev, current) => prev + current, 0);
};


export interface SingleFeeByDateAndKeyParams extends CommonParams {
	feeKey: FeeKey;
}

/**
 * Calculates the fee value for a given fee key and date.
 *
 * @param {SingleFeeByDateAndKeyParams} params - Parameters for calculating the fee value
 * @returns {number} Fee value for the given fee key and date
 */
export const singleFeeByDateAndKey = ({
	feesData,
	feeKey,
	date
}: SingleFeeByDateAndKeyParams): number => {
	// Filter feesData to keep only the entries that match the feeKey and are not later than the given date
	const filteredFees = feesData.filter(({ key, from }) => {
		const fromDate = DateTime.fromISO(from, { zone: 'utc' });
		return key === feeKey && fromDate <= date;
	});

	// If there are filtered fees, find the most recent one and return its value
	if (filteredFees.length) {
		const mostRecentFee = filteredFees.reduce((prev, current) => {
			const prevDate = DateTime.fromISO(prev.from, { zone: 'utc' });
			const currentDate = DateTime.fromISO(current.from, { zone: 'utc' });
			return prevDate > currentDate ? prev : current;
		});

		return mostRecentFee.value;
	}

	// If there are no filtered fees, return 0
	return 0;
};
