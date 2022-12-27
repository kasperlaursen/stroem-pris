import { createClient } from '@supabase/auth-helpers-sveltekit';
import { env } from '$env/dynamic/public';

export const LIMIT = 1000;
export const supabase = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY);
