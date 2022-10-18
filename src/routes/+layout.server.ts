import type { LayoutServerLoad } from '.svelte-kit/types/src/routes/$types';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';

export const load: LayoutServerLoad = async (event) => {
	return {
		session: await getServerSession(event)
	};
};
