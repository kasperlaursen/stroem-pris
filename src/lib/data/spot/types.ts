import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import type { DateTime } from 'luxon';
import type { PriceAreas } from './energidataservice/types';

export interface SpotBaseParams {
	/** The first date to get data points from. (Danish time) */
	from: DateTime;
	/** The last data point will be the last hour of the day before this date. (Danish time) */
	to: DateTime;
	/** The area to get data from. */
	area: PriceAreas;
}

export interface SupabaseBaseParams {
	/** The supabaseClient used to get data from the database */
	supabaseClient: TypedSupabaseClient;
}

export interface SpotData {
	/** The UTC Hour the for the datapoint */
	hourUTC: Date;
	/** The price area the for the datapoint */
	priceArea: PriceAreas;
	/** The price in DKK (øre) for the for the datapoint */
	priceDKK: number;
}
