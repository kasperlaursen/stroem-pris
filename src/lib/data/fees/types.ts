/**
 * A map of available net companies.
 * Must be kept in sync with the net_company column in the nettarif table.
 */
export const netCompanies = {
	elinord: 'elinord',
	n1: 'n1',
	radius: 'radius',
	cerius: 'cerius',
	trefor_ost: 'trefor_ost',
	trefor_vest: 'trefor_vest',
	elektrus: 'elektrus',
	vores_elnet: 'vores_elnet',
	konstant: 'konstant',
	dinels: 'dinels',
	noe: 'noe',
	ingen: 'ingen'
} as const;

export const netCompaniesArray = Object.keys(netCompanies) as NetCompany[];

/**
 * A Type containing string literals for all available net companies.
 */
export type NetCompany = keyof typeof netCompanies;

/**
 * An array containing all the possible values for HourOfDay.
 */
export const hourOfDayArray = [
	0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23
] as const;

/**
 * A Type containing number literals for all possible hours of the day.
 */
export type HourOfDay = (typeof hourOfDayArray)[number];
