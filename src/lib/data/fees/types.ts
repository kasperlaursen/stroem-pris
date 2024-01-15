/**
 * A map of available net companies.
 * Must be kept in sync with the net_company column in the nettarif table.
 */
export const netCompanies = {
  elinord: "Elinord ikke opdateret",
  n1: "N1 ikke opdateret",
  radius: "Radiuse ikke opdateret",
  cerius: "Cerius ikke opdateret",
  trefor_ost: "Trefor Øst ikke opdateret",
  trefor_vest: "Trefor Vest ikke opdateret",
  elektrus: "Elektrus ikke opdateret",
  vores_elnet: "Vores Elnet ikke opdateret",
  konstant: "Konstant kke opdateret",
  dinels: "Dinels ikke opdateret",
  noe: "NOE opdateret 01-24",
  ingen: "ingen",
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
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23,
] as const;

/**
 * A Type containing number literals for all possible hours of the day.
 */
export type HourOfDay = (typeof hourOfDayArray)[number];
