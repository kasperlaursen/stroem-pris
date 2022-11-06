/** Structure for internal error massages */
export type InternalError = { message: string };

/** Internal API response structure for successful external fetch calls */
type InternalApiResponseSuccess<Data> = { success: true; data: Data };
/** Internal API response structure for UNsuccessful external fetch calls */
type InternalApiResponseError = { success: false; error: InternalError };

/** The resposne returned from fucntions doing calls to external APIs */
export type InternalApiResponse<Data> = InternalApiResponseSuccess<Data> | InternalApiResponseError;
