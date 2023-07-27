<script lang="ts">
    import { spotDataToSpotChartEntries } from "$lib/utils/spotDataToSpotChartEntries";
    import type { SpotChartData } from "$lib/components/Charts/SpotChart/types";
    import { userSettings } from "$lib/stores/userSettingsStore";
    import SpotChart from "$lib/components/Charts/SpotChart/SpotChart.svelte";
    import type { SpotData } from "$lib/data/spot/types";
    import type { FeesData } from "$lib/data/fees/getFees";
    import type { NettariffsData } from "$lib/data/fees/getNettarrifs";
  
    const CHART_MAX_MULTIPLIER = 1.1;
  
    export let spotData: SpotData[] | undefined;
    export let feesData: FeesData[] | undefined;
    export let netTarifData: NettariffsData[] | undefined;
  
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
  </script>
  
  {#if spotChartData}
    <SpotChart data={spotChartData} autoScroll />
  {/if}
  