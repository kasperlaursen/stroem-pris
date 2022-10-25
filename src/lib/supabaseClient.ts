import { createClient } from '@supabase/auth-helpers-sveltekit';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

/** The limit of select in supabase */
export const LIMIT = 1000; 

export const supabaseClient = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
