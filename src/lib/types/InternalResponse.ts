/** Structure for internal error massages */
export type InternalError = { message: string; code?: number | string };

/** Internal  response structure for successful external fetch calls */
export type InternalResponseSuccess<Data> = { success: true; data: Data; message?: string };
/** Internal  response structure for UNsuccessful external fetch calls */
export type InternalResponseError = { success: false; error: InternalError };

/** The resposne returned from fucntions doing calls to external s */
export type InternalResponse<Data> = InternalResponseSuccess<Data> | InternalResponseError;
