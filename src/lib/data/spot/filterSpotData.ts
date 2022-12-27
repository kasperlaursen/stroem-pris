import { DateTime } from 'luxon';
import type { SpotData } from './types';

interface Params {
	existingEntries: SpotData[];
	newEntries: SpotData[];
}
export const filterSpotData = ({ existingEntries, newEntries }: Params) => {
	const filteredData = newEntries.filter(
		(newEntry) =>
			!existingEntries?.some(
				(existingEntry) =>
					DateTime.fromJSDate(existingEntry.hourUTC).toSeconds() ===
						DateTime.fromJSDate(newEntry.hourUTC).toSeconds() &&
					existingEntry.priceArea === newEntry.priceArea
			)
	);
	return filteredData;
};
