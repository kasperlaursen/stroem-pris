import type { SpotChartDataEntry } from '$lib/components/Charts/SpotChart/types';
import type { SpotData } from '$lib/data/spot/types';
import { DateTime } from 'luxon';
import { PRICE_MULTIPLIER } from './constants';
import type { FeesData } from '$lib/data/fees/getFees';
import type { UserSettings } from '$lib/stores/userSettingsStore';
import { currentFeesByDateAndKey } from './currentFeesByDateAndKey';
import type { NettariffsData } from '$lib/data/fees/getNettarrifs';
import { currentNetTarrifByDate } from './currentNetTarrifByDate';

/**
 * Interface representing the parameters for the spotDataToSpotChartEntries function.
 * @typedef {Object} Params
 * @property {SpotData[]} spotData - An array of spot data objects.
 * @property {('ASC'|'DESC')} [order='ASC'] - Optional order for sorting the data. Defaults to 'ASC'.
 */
interface Params {
	/** An array of spot data objects. */
	spotData: SpotData[];
	/** Fees added to the price based on user settings. */
	feesData: FeesData[];
	/** The tarriffs for the selected net company */
	netTarifData?: NettariffsData[];
	/** User settings used to determine what fees to include in the price. */
	settings: UserSettings;
	/** Optional order for sorting the data. Defaults to 'ASC'. */
	order?: 'ASC' | 'DESC';
}

/**
 * Transforms an array of spot data objects into an array of SpotChartDataEntry objects and sorts them based on the specified order.
 * Based on the feesData and settings parameters, the price is adjusted to include or exclude fees.
 *
 * @param {Params} params - An object containing the spotData array and an optional sorting order.
 * @returns {SpotChartDataEntry[]} - An array of transformed SpotChartDataEntry objects.
 */
export const spotDataToSpotChartEntries = ({
	spotData,
	feesData,
	netTarifData,
	settings,
	order = 'ASC'
}: Params): SpotChartDataEntry[] => {
	const transformedData = spotData.map(({ hourUTC, priceDKK }) => {
		const time = DateTime.fromJSDate(hourUTC).setZone('Europe/Copenhagen');
		const feesAtTime = currentFeesByDateAndKey({ feesData, settings, date: time }) / 100;
		const netTarrifAtTime =
			currentNetTarrifByDate({ netTarifData, settings, dateTime: time }) / 100;
		const spotPrice = priceDKK * PRICE_MULTIPLIER;
		const vatMultiplier = settings.includeVat ? 1.25 : 1;
		const price = (spotPrice + feesAtTime + netTarrifAtTime) * vatMultiplier;

		return {
			price,
			time
		};
	});

	const sortedData =
		order === 'DESC' ? transformedData.sort(sortDESC) : transformedData.sort(sortASC);
	return sortedData;
};

/**
 * Sorts SpotChartDataEntry objects by ascending time, so that the oldest time is first.
 * @param {SpotChartDataEntry} timeA - The first entry to compare.
 * @param {SpotChartDataEntry} timeB - The second entry to compare.
 * @returns {number} - The comparison result for sorting. A negative number if timeA < timeB, 0 if timeA == timeB, or a positive number if timeA > timeB.
 */
const sortASC = (
	{ time: timeA }: SpotChartDataEntry,
	{ time: timeB }: SpotChartDataEntry
): number => timeB.toMillis() - timeA.toMillis();

/**
 * Sorts SpotChartDataEntry objects by descending time, so that the newest time is first.
 * @param {SpotChartDataEntry} timeA - The first entry to compare.
 * @param {SpotChartDataEntry} timeB - The second entry to compare.
 * @returns {number} - The comparison result for sorting. A negative number if timeA < timeB, 0 if timeA == timeB, or a positive number if timeA > timeB.
 */
const sortDESC = (
	{ time: timeA }: SpotChartDataEntry,
	{ time: timeB }: SpotChartDataEntry
): number => timeA.toMillis() - timeB.toMillis();
