import { error } from '@sveltejs/kit';
import { DateTime } from 'luxon';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	// Get data parameters and validate
	const fromDateParam = url.searchParams.get('from');
	const toDateParam = url.searchParams.get('to');

	if (!fromDateParam || !toDateParam) {
		throw error(400, 'Missing required parameters');
	}

	const fromDate = DateTime.fromISO(fromDateParam, { zone: 'Europe/Copenhagen' });
	const toDate = DateTime.fromISO(toDateParam, { zone: 'Europe/Copenhagen' });

	if (!fromDate.isValid) {
		throw error(400, 'Invalid from date: Must be valid date of the format "yyyy-mm-dd"');
	}

	if (!toDate.isValid) {
		throw error(400, 'Invalid to date: Must be valid date of the format "yyyy-mm-dd"');
	}

	if (fromDate > toDate) {
		throw error(400, 'The "to" date must be later than the "from" date');
	}

	// Call supabase to check if data is available for the date range

	// If YES: Return data from Database

	// If NO: Get data from external API
	// Save data to Database
	// Return data

	return new Response(String('Responded'));
};
