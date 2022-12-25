import { setPassword } from '$lib/auth/setPassword';
import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	setPassword: async (event) => {
		const setPasswordResult = await setPassword(event);

		if (setPasswordResult.success === false) {
			return setPasswordResult;
		}

		throw redirect(303, '/guide');
	}
};