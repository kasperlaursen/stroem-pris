<script lang="ts">
  import SpotChart from "$lib/components/Charts/SpotChart/SpotChart.svelte";
  import Card from "$lib/components/Card/Card.svelte";
  import type { SpotChartData } from "$lib/components/Charts/SpotChart/types";
  import { spotDataToSpotChartEntries } from "$lib/utils/spotDataToSpotChartEntries";
  import { priceInfoMessageFromUserSettings } from "$lib/utils/priceInfoMessageFromUserSettings";
  import ErrorList from "$lib/ui/ErrorList/ErrorList.svelte";
  import PriceAreaForm from "./PriceAreaForm.svelte";
  import {
    userSettings,
  } from "$lib/stores/userSettingsStore";
  import { selectedHour } from "$lib/stores/selectedHourStore";
  import { browser } from "$app/environment";
  import HourPriceInfo from "./HourPriceInfo.svelte";
  import { cva } from "class-variance-authority";
  import Button from "$lib/components/Button/Button.svelte";
  import { Icon } from "@steeze-ui/svelte-icon";
  import { XMark } from "@steeze-ui/heroicons";

  const CHART_MAX_MULTIPLIER = 1.1;

  export let data;
  let { data: pageData, errors, area, netcompanyParam } = data;
  let { spotData, feesData, netTarifData } = pageData;

  let spotChartData: SpotChartData | null = null;

  $: {
    if (spotData && feesData) {
      const chartEntries = spotDataToSpotChartEntries({
        spotData,
        feesData,
        netTarifData,
        settings: $userSettings,
      });

      const entiresPrice = chartEntries.map((entry) => entry.price);
      const entiresAverage =
        entiresPrice.reduce((sum, num) => sum + num, 0) / entiresPrice.length;
      const chartMax = Math.max(...entiresPrice);

      spotChartData = {
        average: entiresAverage,
        max: chartMax * CHART_MAX_MULTIPLIER,
        entries: chartEntries,
      };
    }
  }



  if ($userSettings.netCompany && !netcompanyParam && browser) {
    const url = new URL(window.location.href);
    url.searchParams.set("netcompany", $userSettings.netCompany);
    window.location.href = url.href;
  }

  $: hasSelectedSettings = Object.values($userSettings).some(
    (value) => value === true,
  );

  const cardContainer = cva(["grid", "overflow-hidden", "gap-4"], {
    variants: {
      isMultiColumn: {
        true: ["lg:grid-cols-[1fr,400px]"],
        false: [],
      },
    },
  });

  const pieChartCard = cva(["grid", "h-full", "lg:relative", "lg:h-max"], {
    variants: {},
  });

  const rightColumn = cva(
    [
      "z-10",
      "inset-0",
      "absolute",
      "lg:relative",
      "h-full",
      "overflow-y-auto",
      "gap-4",
      "lg:max-h-full",
      "lg:h-min",
    ],
    {
      variants: {
        visible: {
          true: ["grid"],
          false: ["hidden", "lg:grid"],
        },
      },
    },
  );
</script>

<div class="max-h-full overflow-hidden grid grid-rows-[auto_auto_minmax(auto,1fr)]">
  <ErrorList {errors} />
  <div class="flex justify-between items-center p-2">
    <h1 class="font-medium text-gray-800 dark:text-gray-200">
      Variabel Strømpris
    </h1>
    <PriceAreaForm {area} />
  </div>
  <div class={cardContainer({ isMultiColumn: hasSelectedSettings })}>
    <div class="overflow-hidden">
    <Card class="overflow-y-auto mb-2 max-h-full">
      {#if spotChartData}
        <SpotChart data={spotChartData} autoScroll />
      {/if}
      <small class="px-2"
        >{priceInfoMessageFromUserSettings($userSettings)} -
        <a
          class="text-primary-500 underline hover:text-primary-400"
          target="_blank"
          href="/settings"
        >
          Tilpas her
        </a>
      </small>
    </Card>
  </div>

    {#if hasSelectedSettings}
      <div
        class={rightColumn({ visible: Boolean($selectedHour.selectedHour) })}
      >
        <Card class={pieChartCard()}>
          <Button
            variant="ghost"
            class="absolute top-4 right-4 lg:hidden"
            on:click={() => selectedHour.set({ selectedHour: undefined })}
          >
            <Icon src={XMark} theme="solid" class="h-6 w-6" />
          </Button>
          <HourPriceInfo
            spotData={spotData ?? []}
            feesData={feesData ?? []}
            netTarifData={netTarifData ?? []}
            hour={$selectedHour.selectedHour}
          />
        </Card>
      </div>
    {/if}
  </div>
</div>
