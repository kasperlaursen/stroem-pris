import type { SupabaseClient } from "@supabase/supabase-js";

export interface SupabaseBaseParams {
	/** The supabaseClient used to get data from the database */
	supabaseClient: SupabaseClient;
}