import type { InternalResponseError } from '$lib/types/InternalResponse';

/** Used to return an InternalResposne error in fewer lines */
export const returnError = (code: number | string, message: string): InternalResponseError => ({
	success: false,
	error: {
		code,
		message
	}
});
