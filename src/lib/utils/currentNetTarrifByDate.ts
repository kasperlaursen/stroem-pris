import type { NettariffsData } from "$lib/data/fees/getNettarrifs";
import type { UserSettings } from "$lib/stores/userSettingsStore";
import { DateTime } from "luxon";

export interface CurrentNetTarrifByDateParams {
  /** User settings used to determine what nettariff to include in the price. */
  settings: UserSettings;
  /** The tarriffs for the selected net company. */
  netTarifData?: NettariffsData[];
  /** The date and time to get the tarrif for. */
  dateTime: DateTime;
}

/**
 * Returns the current net tariff value for a given date and time based on the provided user settings and net tariff data.
 */
export const currentNetTarrifByDate = ({
  netTarifData,
  settings,
  dateTime,
}: CurrentNetTarrifByDateParams): number => {
  if (!settings.includeTariff || !netTarifData || netTarifData.length === 0) {
    return 0;
  }

  const currentHour = dateTime.hour;

  const relevantNetTariffs = netTarifData.filter(({ fromDate, hourOfDay }) => {
    const tariffStartTime = DateTime.fromISO(fromDate, { zone: "utc" });
    return tariffStartTime <= dateTime && hourOfDay === currentHour;
  });

  if (relevantNetTariffs.length === 0) {
    return 0;
  }

  const mostRecentTariff = relevantNetTariffs.reduce(
    (previousTariff, currentTariff) => {
      const previousTariffDate = DateTime.fromISO(previousTariff.fromDate, {
        zone: "utc",
      });
      const currentTariffDate = DateTime.fromISO(currentTariff.fromDate, {
        zone: "utc",
      });
      return previousTariffDate > currentTariffDate
        ? previousTariff
        : currentTariff;
    },
  );

  return mostRecentTariff.value;
};
