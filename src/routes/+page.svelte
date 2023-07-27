<script lang="ts">
  import Card from "$lib/components/Card/Card.svelte";
  import { priceInfoMessageFromUserSettings } from "$lib/utils/priceInfoMessageFromUserSettings";
  import ErrorList from "$lib/ui/ErrorList/ErrorList.svelte";
  import { userSettings } from "$lib/stores/userSettingsStore";
  import { browser } from "$app/environment";
  import TitleAndSelect from "./TitleAndSelect.svelte";
  import { cva } from "class-variance-authority";
  import SpotChartWrapper from "./SpotChartWrapper.svelte";
  import HourPriceInfoCard from "./HourPriceInfoCard.svelte";

  export let data;
  let { data: pageData, errors, area, netcompanyParam } = data;
  let { spotData, feesData, netTarifData } = pageData;

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
</script>

<div class="max-h-full overflow-hidden grid grid-rows-[auto_auto_minmax(auto,1fr)]">
  <ErrorList {errors} />
  <TitleAndSelect {area} />
  <div class={cardContainer({ isMultiColumn: hasSelectedSettings })}>
    <div class="overflow-hidden">
      <Card class="overflow-y-auto mb-2 max-h-full">
        <SpotChartWrapper {spotData} {feesData} {netTarifData} />
        <small class="px-2">
          {priceInfoMessageFromUserSettings($userSettings)} -
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
      <HourPriceInfoCard {spotData} {feesData} {netTarifData} />
    {/if}
  </div>
</div>
