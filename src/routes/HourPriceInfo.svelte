<script lang="ts">
  import PieChart from "$lib/components/Charts/PieChart/PieChart.svelte";
  import type { PieChartData } from "$lib/components/Charts/PieChart/types";
  import type { FeesData } from "$lib/data/fees/getFees";
  import type { NettariffsData } from "$lib/data/fees/getNettarrifs";
  import type { SpotData } from "$lib/data/spot/types";
  import { userSettings } from "$lib/stores/userSettingsStore";
  import { singleFeeByDateAndKey } from "$lib/utils/currentFeesByDateAndKey";
  import { currentNetTarrifByDate } from "$lib/utils/currentNetTarrifByDate";
  import { userSettingsToFeesKeyList } from "$lib/utils/userSettingsToFeesKeyList";
  import { DateTime } from "luxon";

  export let spotData: SpotData[];
  export let feesData: FeesData[];
  export let netTarifData: NettariffsData[];
  export let hour: DateTime = DateTime.now();

  const currentTime = DateTime.now();

  $: getLabel = () => {
    const currentLabel = "Nuværende prisfordeling";
    if (!hour) {
      return currentLabel;
    }

    if (currentTime.day !== hour.day || currentTime.hour !== hour.hour) {
      return `Prisfordeling ${hour.toFormat("kl H")} ${hour
        .plus({ days: currentTime.diff(hour).days })
        .toRelativeCalendar({ locale: "da" })}`;
    }

    return currentLabel;
  };

  $: getChartData = () => {
    const timeToShow = hour
      ? hour.set({ minute: 0, second: 0, millisecond: 0 })
      : currentTime;

    const feeKeys = userSettingsToFeesKeyList({ settings: $userSettings });

    const currentSpot = spotData.find((spot) => {
      const entryTime = DateTime.fromJSDate(spot.hourUTC)
        .setZone("Europe/Copenhagen")
        .set({ minute: 0, second: 0, millisecond: 0 });
      if (
        timeToShow.toISODate() === entryTime.toISODate() &&
        timeToShow.hour === entryTime.hour
      ) {
        return true;
      }
      return false;
    });

    const prices: { [key: string]: number } = {
      nettarif: currentNetTarrifByDate({
        netTarifData: netTarifData,
        settings: $userSettings,
        dateTime: timeToShow,
      }),
      spot: (currentSpot?.priceDKK ?? 0) / 10,
    };

    feeKeys.forEach((key) => {
      prices[key] = singleFeeByDateAndKey({
        feesData,
        feeKey: key,
        date: timeToShow,
      });
    });

    const totalPrice = Object.values(prices).reduce(
      (sum, entry) => sum + entry,
      0,
    );

    const moms = $userSettings.includeVat ? totalPrice * 0.25 : 0;

    const chartData: PieChartData[] = [
      {
        label: "Spot",
        value: prices.spot,
        color: "fill-primary-500 dark:fill-primary-600",
      },
      {
        label: "Nettarif",
        value: prices.nettarif,
        color: "fill-cyan-500 dark:fill-cyan-600",
      },
      {
        label: "Moms",
        value: moms,
        color: "fill-sky-500 dark:fill-sky-600",
      },
      {
        label: "Elafgift",
        value: prices.elafgift,
        color: "fill-slate-600 dark:fill-slate-700",
      },
      {
        label: "Transmissionstarif",
        value: prices.transmissionstarif,
        color: "fill-slate-400 dark:fill-slate-400",
      },
      {
        label: "Systemtarif",
        value: prices.systemtarif,
        color: "fill-slate-500 dark:fill-slate-500",
      },
    ].filter((entry) => Boolean(entry.value)) as PieChartData[];

    return chartData;
  };
</script>

<div class="grid place-items-center">
  <h2 class="font-medium">{getLabel()}</h2>
  <PieChart class="w-full" data={getChartData()} />
</div>
