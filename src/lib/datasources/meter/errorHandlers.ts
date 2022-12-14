import type { InternalApiResponse } from '$lib/types/api';
import type { InvalidDateReturn } from '$lib/utils/dateValidaton';

export const handleInvalidDates = (
	dateValidaton: InvalidDateReturn,
	fromDateString: string | null,
	toDateString: string | null
): InternalApiResponse<any> => {
	console.log('📊 🚫', `INVALID DATES! ${fromDateString} -> ${toDateString}`);
	return {
		success: false,
		error: { code: dateValidaton.errorCode, message: dateValidaton.errorMessage }
	};
};

export const handleLimitExceeded = (hourDiff: number, limit: number): InternalApiResponse<any> => {
	console.log('📊 🚫', `LIMIT EXCEEDED! ${hourDiff} > ${limit}`);
	return {
		success: false,
		error: {
			code: 400,
			message: `😞 Period is too long, requested ${hourDiff} data point, but no more than ${limit} is allowed`
		}
	};
};
