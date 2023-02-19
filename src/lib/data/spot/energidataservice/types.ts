/**
 * An array of available price areas in the energidataservice.
 * _Use this for runtime validation of strings as price areas._
 */
export const priceAreas = ['DK1', 'DK2'] as const;

/**
 * Type for available price areas in the energidataservice.
 */
export type PriceAreas = (typeof priceAreas)[number];

/**
 * An interface for RAW spot data fom the energidataservice.
 */
export interface SpotDataRaw {
	HourUTC: string;
	HourDK: string;
	PriceArea: PriceAreas;
	SpotPriceDKK: number;
	SpotPriceEUR: number;
}

/**
 * The full response form the api after .json()
 */
export interface SpotResponse {
	statusCode?: number;
	total?: number;
	limit?: number;
	records?: SpotDataRaw[];
}
