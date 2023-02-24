import type { InternalResponse, InternalResponseError } from '$lib/types/InternalResponse';
import type { SupabaseClient } from '@supabase/supabase-js';
import { DateTime } from 'luxon';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getForDateRange, type Params } from './getForDateRange';
import { getSpotFromDatabase } from './getSpotFromDatabase';
import { saveSpotDataToDatabasse } from './saveSpotDataToDatabasse';
import { energidataservice } from './energidataservice';
import type { SpotData } from './types';
import { LIMIT } from '../supabase/constants';

const mockHour: SpotData = {
	hourUTC: new Date('2022-01-01T00:00:00.000Z'),
	priceArea: 'DK1',
	priceDKK: 100.0
};

const mockDay: SpotData[] = Array.apply(null, Array(24)).map((_, index) => ({
	...mockHour,
	hourUTC: new Date(`2022-01-01T${`0${index}`.slice(-2)}:00:00.000Z`)
}));

const mockParams = {
	from: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
	to: DateTime.fromISO('2022-01-01T01:00:00.000Z'),
	area: 'DK1',
	supabaseClient: {} as SupabaseClient
} as Params;

vi.mock('./getSpotFromDatabase', () => ({
	getSpotFromDatabase: vi.fn()
}));

vi.mock('./saveSpotDataToDatabasse', () => ({
	saveSpotDataToDatabasse: vi.fn()
}));

vi.mock('./energidataservice', () => ({
	energidataservice: { getSpotData: vi.fn() }
}));

describe('getForDateRange', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('Sandels invalid date Ranges', async () => {
		const params = {
			...mockParams,
			from: DateTime.fromISO('2022-01-01T02:00:00.000Z'), // From date is after to date...
			to: DateTime.fromISO('2022-01-01T01:00:00.000Z')
		};

		const response = await getForDateRange(params);
		expect(response.success).toEqual(false);
		expect((response as InternalResponseError).error.code).toEqual(400);
	});

	it('Returns data if it is in database', async () => {
		vi.mocked(getSpotFromDatabase).mockResolvedValueOnce({
			success: true,
			data: mockDay // The getSpotFromDatabase function always returns a full day of data, which is filtered before return
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

	it('Returns an error on getSpotFromDatabase error', async () => {
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

	it('Returns data even if it could not be saved to database', async () => {
		vi.mocked(getSpotFromDatabase).mockResolvedValueOnce({
			success: true,
			data: mockDay // The getSpotFromDatabase function always returns a full day of data, which is filtered before return
		});

		vi.mocked(saveSpotDataToDatabasse).mockResolvedValueOnce({
			success: false,
			error: { message: 'Error message' }
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

	it('Should call energidataservice if databasse is missing entries', async () => {
		vi.mocked(getSpotFromDatabase).mockResolvedValueOnce({
			success: true,
			data: [mockHour]
		});

		vi.mocked(energidataservice.getSpotData).mockResolvedValueOnce({
			success: true,
			data: {}
		});

		vi.mocked(saveSpotDataToDatabasse).mockResolvedValueOnce({
			success: false,
			error: { message: 'Error message' }
		});

		const getSpotData = vi.mocked(energidataservice).getSpotData;

		const params = { ...mockParams };
		await getForDateRange(params);
		expect(getSpotData).toHaveBeenCalledOnce();
	});

	it('Returns error on dates greater than DB limit', async () => {
		const params = {
			...mockParams,
			from: DateTime.fromISO('2022-01-01T02:00:00.000Z'),
			to: DateTime.fromISO('2022-01-01T02:00:00.000Z').plus({ hours: LIMIT + 1 })
		};

		const response = await getForDateRange(params);
		expect(response.success).toEqual(false);
		expect((response as InternalResponseError).error.code).toEqual(400);
	});
});
