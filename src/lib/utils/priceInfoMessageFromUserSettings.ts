import { type UserSettings } from "$lib/stores/userSettingsStore";

export const priceInfoMessageFromUserSettings = ({
  includeTax,
  includeFees,
  includeTariff,
  includeVat,
  netCompany,
}: UserSettings): string => {
  const includedList = [
    includeTax ? `Elafgift` : null,
    includeTariff ? `Tariffer (${netCompany})` : null,
    includeFees ? `Gebyrer` : null,
    includeVat ? `Moms` : null,
  ];
  const includedString = includedList.filter(Boolean).join(", ");
  return includedString
    ? `Viser Spot pris inkluisv: ${includedString}`
    : "Viser Spot pris eksklusiv Gebyrer, Tariffer, Elafgift og Moms";
};
