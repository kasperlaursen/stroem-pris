import type { InternalResponseError } from '$lib/types/InternalResponse';

/**
 * Returns an InternalResponse error in fewer lines
 *
 * @param code error code
 * @param message error message
 */
export const returnError = (code: number | string, message: string): InternalResponseError => ({
	success: false,
	error: {
		code,
		message
	}
});
