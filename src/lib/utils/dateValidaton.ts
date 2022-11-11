import { DateTime } from 'luxon';

interface ValidDateReturn {
	isValid: true;
	fromDate: DateTime;
	toDate: DateTime;
	hourDiff: number;
}

interface InvalidDateReturn {
	isValid: false;
	errorCode: number;
	errorMessage: string;
}

type DateReturn = ValidDateReturn | InvalidDateReturn;

/**
 * Validates a from and to dates from strings and returns them as DateTime or returns an error object.
 *
 * @param fromDateString The from date in the format yyyy-mm-dd
 * @param toDateString The to date in the format yyyy-mm-dd
 */
export const validateStringsAsISODateRange = (
	fromDateString: string | null,
	toDateString: string | null,
	maxToday: boolean = false
): DateReturn => {
	// Validate required parameters exist
	if (!fromDateString || !toDateString) {
		return { isValid: false, errorCode: 400, errorMessage: 'Missing required parameters' };
	}

	// Split date param to array
	const fromDateSplit = fromDateString.split('-');
	const toDateSplit = toDateString.split('-');

	// Verify date parameters has correct length
	if (fromDateSplit.length !== 3 || toDateSplit.length !== 3) {
		return {
			isValid: false,
			errorCode: 400,
			errorMessage: 'Invalid date: Must be valid date of the format "yyyy-mm-dd"'
		};
	}

	// Convert date parameters to DateTime
	const fromDate = DateTime.fromObject(
		{
			year: Number(fromDateSplit[0]),
			month: Number(fromDateSplit[1]),
			day: Number(fromDateSplit[2])
		},
		{ zone: 'Europe/Copenhagen' }
	);

	const toDate = DateTime.fromObject(
		{
			year: Number(toDateSplit[0]),
			month: Number(toDateSplit[1]),
			day: Number(toDateSplit[2])
		},
		{ zone: 'Europe/Copenhagen' }
	);

	// Validate dates are valid
	if (!fromDate.isValid) {
		return {
			isValid: false,
			errorCode: 400,
			errorMessage: '🤨 Invalid from date: Must be valid date of the format "yyyy-mm-dd"'
		};
	}
	if (!toDate.isValid) {
		return {
			isValid: false,
			errorCode: 400,
			errorMessage: '🤨 Invalid to date: Must be valid date of the format "yyyy-mm-dd"'
		};
	}

	// toDate no later than now
	const now = DateTime.now();
	const safeToDate =
		maxToday && toDate.diffNow('days').days >= 0
			? DateTime.fromObject({
					day: now.day,
					month: now.month,
					year: now.year
			  })
			: toDate;

	// Get hours between from and to dates
	const hourDiff = safeToDate.diff(fromDate, 'hours').toObject().hours;

	// Make sure to date is after from date
	if (fromDate > safeToDate || !hourDiff || hourDiff < 0) {
		return {
			isValid: false,
			errorCode: 400,
			errorMessage: '🤦‍♂️ The "to" date must be later than the "from" date'
		};
	}

	return { isValid: true, fromDate, toDate: safeToDate, hourDiff };
};