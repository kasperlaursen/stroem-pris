import { describe, it, expect } from 'vitest';
import type { SpotResponse } from './energidataservice/types';
import { spotResponseToSpotData } from './spotResponseToSpotData';
import type { SpotData } from './types';

describe('spotResponseToSpotData', () => {
	it('should convert datapoint correctly', () => {
		const input: SpotResponse = {
			total: 2,
			records: [
				{
					HourUTC: '2021-02-02T22:00:00',
					HourDK: '2021-02-02T23:00:00',
					PriceArea: 'DK2',
					SpotPriceDKK: 312.230011,
					SpotPriceEUR: 41.98
				},
				{
					HourUTC: '2021-02-02T21:00:00',
					HourDK: '2021-02-02T22:00:00',
					PriceArea: 'DK2',
					SpotPriceDKK: 346.149994,
					SpotPriceEUR: 46.540001
				}
			]
		};
		const expected: SpotData[] = [
			{
				hourUTC: new Date('2021-02-02T22:00:00.000Z'),
				priceArea: 'DK2',
				priceDKK: 312.230011
			},
			{
				hourUTC: new Date('2021-02-02T21:00:00.000Z'),
				priceArea: 'DK2',
				priceDKK: 346.149994
			}
		];

		const result = spotResponseToSpotData(input);
		expect(result).toEqual(expected);
	});

	it('should handle no records', () => {
		const input: SpotResponse = {
			total: 2,
			records: []
		};
		const expected: SpotData[] = [];

		const result = spotResponseToSpotData(input);
		expect(result).toEqual(expected);
	});

	it('should handle no undefined records', () => {
		const input: SpotResponse = {
			total: 0
		};
		const expected: SpotData[] = [];

		const result = spotResponseToSpotData(input);
		expect(result).toEqual(expected);
	});
});
