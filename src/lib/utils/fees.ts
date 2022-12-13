import type { FeeKeys } from '$lib/types/fees';
import { DateTime } from 'luxon';

export const getCurrentFeeByDateAndKey = (
	feesData: {
		from: string;
		key: FeeKeys;
		value: number;
	}[],
	feeKey: FeeKeys,
	date: DateTime
): number => {
	const filteredFees = feesData.filter(
		({ key, from }) => key === feeKey && DateTime.fromISO(from, { zone: 'utc' }) <= date
	);
	if (filteredFees.length) {
		return filteredFees.reduce((r, a) => {
			return DateTime.fromISO(r.from, { zone: 'utc' }) > DateTime.fromISO(a.from, { zone: 'utc' })
				? r
				: a;
		}).value;
	}
	return 0;
};
