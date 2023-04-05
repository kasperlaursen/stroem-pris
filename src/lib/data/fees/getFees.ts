import type { InternalResponse } from '$lib/types/InternalResponse';
import { returnError } from '$lib/utils/returnError';
import type { Database } from '../supabase/types';
import type { SupabaseBaseParams } from '../types';

/** Fees interface representing a fee structure. */
export interface Fees {
	/** The starting point for the fee range. */
	from: string;

	/** The key identifying the fee. */
	key: Database['public']['Enums']['energy_fees'];

	/** The value of the fee. */
	value: number;
}

/**
 * Fetches fees from the database and returns them in an InternalResponse object.
 *
 * @param {SupabaseBaseParams} params - The parameters required for making a request to the Supabase client.
 * @returns {Promise<InternalResponse<Fees[]>>} - A promise that resolves to an InternalResponse object containing an array of Fees.
 */
export const getFees = async (params: SupabaseBaseParams): Promise<InternalResponse<Fees[]>> => {
	const { supabaseClient } = params;
	const fees = await supabaseClient.from('fees').select('from, key, value');
	const { data, error } = fees;

	if (!data || error) {
		return returnError(error?.code ?? 404, error?.message ?? 'No fees found...');
	}

	//TODO: Add a data validation step here to ensure that the data is in the correct format.
	return { success: true, data };
};
