import type { InternalResponse, InternalResponseError } from '$lib/types/InternalResponse';
import type { SupabaseClient } from '@supabase/supabase-js';
import { DateTime } from 'luxon';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getForDateRange, type Params } from './getForDateRange';
import { getSpotFromDatabase } from './getSpotFromDatabase';
import type { SpotData } from './types';

const mockHour: SpotData = {
	hourUTC: new Date('2022-01-01T00:00:00.000Z'),
	priceArea: 'DK1',
	priceDKK: 100.0
};

const mockParams = {
	from: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
	to: DateTime.fromISO('2022-01-01T01:00:00.000Z'),
	area: 'DK1',
	supabaseClient: {} as SupabaseClient
} as Params;

vi.mock('./getSpotFromDatabase', () => ({
	getSpotFromDatabase: vi.fn()
}));

describe('getForDateRange', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('getForDateRange handels invalid date Ranges', async () => {
		const params = {
			...mockParams,
			from: DateTime.fromISO('2022-01-01T02:00:00.000Z'), // From date is after to date...
			to: DateTime.fromISO('2022-01-01T01:00:00.000Z')
		};

		const response = await getForDateRange(params);
		expect(response.success).toEqual(false);
		expect((response as InternalResponseError).error.code).toEqual(400);
	});

	it('getForDateRange returns data if it is in database', async () => {
		vi.mocked(getSpotFromDatabase).mockResolvedValueOnce({
			success: true,
			data: [mockHour]
		});

		const params = { ...mockParams };

		const expectedData: SpotData[] = [mockHour];
		const expectedResponse: InternalResponse<SpotData[]> = {
			success: true,
			data: expectedData
		};

		const response = await getForDateRange(params);
		expect(response).toEqual(expectedResponse);
	});

	it('getForDateRange Returns an error on getSpotFromDatabase error', async () => {
		vi.mocked(getSpotFromDatabase).mockResolvedValueOnce({
			success: false,
			error: { message: 'Error message' }
		});

		const params = { ...mockParams };

		const response = await getForDateRange(params);
		expect(response).toEqual({
			success: false,
			error: { message: 'Error message' }
		});
	});
});
