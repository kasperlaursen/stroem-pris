import { DateTime } from 'luxon';
import { describe, it, expect } from 'vitest';
import { spotDataToSpotChartEntries } from './spotDataToSpotChartEntries';

describe('spotDataToSpotChartEntries', () => {
	it('converts one datapoint correctly', () => {
		const result = spotDataToSpotChartEntries({
			spotData: [
				{
					hourUTC: DateTime.fromISO('2022-01-01T00:00:00.000Z', { zone: 'UTC' }).toJSDate(),
					priceArea: 'DK1',
					priceDKK: 100000.0
				}
			]
		});

		const expected: ReturnType<typeof spotDataToSpotChartEntries> = [
			{
				price: 100,
				time: DateTime.fromISO('2022-01-01T00:00:00.000Z', { zone: 'Europe/Copenhagen' })
			}
		];

		expect(result).toEqual(expected);
	});

	it('converts multiple datapoint correctly', () => {
		const result = spotDataToSpotChartEntries({
			spotData: [
				{
					hourUTC: DateTime.fromISO('2022-01-01T03:00:00.000Z', { zone: 'UTC' }).toJSDate(),
					priceArea: 'DK1',
					priceDKK: 100000.0
				},
				{
					hourUTC: DateTime.fromISO('2022-01-01T02:00:00.000Z', { zone: 'UTC' }).toJSDate(),
					priceArea: 'DK1',
					priceDKK: 100000.0
				},
				{
					hourUTC: DateTime.fromISO('2022-01-01T01:00:00.000Z', { zone: 'UTC' }).toJSDate(),
					priceArea: 'DK1',
					priceDKK: 100000.0
				},
				{
					hourUTC: DateTime.fromISO('2022-01-01T00:00:00.000Z', { zone: 'UTC' }).toJSDate(),
					priceArea: 'DK1',
					priceDKK: 100000.0
				}
			]
		});

		const expected: ReturnType<typeof spotDataToSpotChartEntries> = [
			{
				price: 100,
				time: DateTime.fromISO('2022-01-01T03:00:00.000Z', { zone: 'Europe/Copenhagen' })
			},
			{
				price: 100,
				time: DateTime.fromISO('2022-01-01T02:00:00.000Z', { zone: 'Europe/Copenhagen' })
			},
			{
				price: 100,
				time: DateTime.fromISO('2022-01-01T01:00:00.000Z', { zone: 'Europe/Copenhagen' })
			},
			{
				price: 100,
				time: DateTime.fromISO('2022-01-01T00:00:00.000Z', { zone: 'Europe/Copenhagen' })
			}
		];

		expect(result).toEqual(expected);
	});

	it('sorts ASC by default', () => {
		const result = spotDataToSpotChartEntries({
			spotData: [
				{
					hourUTC: DateTime.fromISO('2022-01-01T00:00:00.000Z', { zone: 'UTC' }).toJSDate(),
					priceArea: 'DK1',
					priceDKK: 100000.0
				},
				{
					hourUTC: DateTime.fromISO('2022-01-01T03:00:00.000Z', { zone: 'UTC' }).toJSDate(),
					priceArea: 'DK1',
					priceDKK: 100000.0
				},
				{
					hourUTC: DateTime.fromISO('2022-01-01T01:00:00.000Z', { zone: 'UTC' }).toJSDate(),
					priceArea: 'DK1',
					priceDKK: 100000.0
				},
				{
					hourUTC: DateTime.fromISO('2022-01-01T02:00:00.000Z', { zone: 'UTC' }).toJSDate(),
					priceArea: 'DK1',
					priceDKK: 100000.0
				}
			]
		});

		const expected: ReturnType<typeof spotDataToSpotChartEntries> = [
			{
				price: 100,
				time: DateTime.fromISO('2022-01-01T03:00:00.000Z', { zone: 'Europe/Copenhagen' })
			},
			{
				price: 100,
				time: DateTime.fromISO('2022-01-01T02:00:00.000Z', { zone: 'Europe/Copenhagen' })
			},
			{
				price: 100,
				time: DateTime.fromISO('2022-01-01T01:00:00.000Z', { zone: 'Europe/Copenhagen' })
			},
			{
				price: 100,
				time: DateTime.fromISO('2022-01-01T00:00:00.000Z', { zone: 'Europe/Copenhagen' })
			}
		];

		expect(result).toEqual(expected);
	});

	it('sorts DESC correctly', () => {
		const result = spotDataToSpotChartEntries({
			order: 'DESC',
			spotData: [
				{
					hourUTC: DateTime.fromISO('2022-01-01T00:00:00.000Z', { zone: 'UTC' }).toJSDate(),
					priceArea: 'DK1',
					priceDKK: 100000.0
				},
				{
					hourUTC: DateTime.fromISO('2022-01-01T03:00:00.000Z', { zone: 'UTC' }).toJSDate(),
					priceArea: 'DK1',
					priceDKK: 100000.0
				},
				{
					hourUTC: DateTime.fromISO('2022-01-01T01:00:00.000Z', { zone: 'UTC' }).toJSDate(),
					priceArea: 'DK1',
					priceDKK: 100000.0
				},
				{
					hourUTC: DateTime.fromISO('2022-01-01T02:00:00.000Z', { zone: 'UTC' }).toJSDate(),
					priceArea: 'DK1',
					priceDKK: 100000.0
				}
			]
		});

		const expected: ReturnType<typeof spotDataToSpotChartEntries> = [
			{
				price: 100,
				time: DateTime.fromISO('2022-01-01T00:00:00.000Z', { zone: 'Europe/Copenhagen' })
			},
			{
				price: 100,
				time: DateTime.fromISO('2022-01-01T01:00:00.000Z', { zone: 'Europe/Copenhagen' })
			},
			{
				price: 100,
				time: DateTime.fromISO('2022-01-01T02:00:00.000Z', { zone: 'Europe/Copenhagen' })
			},
			{
				price: 100,
				time: DateTime.fromISO('2022-01-01T03:00:00.000Z', { zone: 'Europe/Copenhagen' })
			}
		];

		expect(result).toEqual(expected);
	});
});
