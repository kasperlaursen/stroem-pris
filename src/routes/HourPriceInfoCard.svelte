<script lang="ts">
    import { selectedHour } from "$lib/stores/selectedHourStore";
    import Card from "$lib/components/Card/Card.svelte";
    import Button from "$lib/components/Button/Button.svelte";
    import { Icon } from "@steeze-ui/svelte-icon";
    import { XMark } from "@steeze-ui/heroicons";
    import HourPriceInfo from "./HourPriceInfo.svelte";
    import { cva } from "class-variance-authority";
    import type { FeesData } from "$lib/data/fees/getFees";
    import type { NettariffsData } from "$lib/data/fees/getNettarrifs";
    import type { SpotData } from "$lib/data/spot/types";
  
    export let spotData: SpotData[] | undefined;
    export let feesData: FeesData[] | undefined;
    export let netTarifData: NettariffsData[] | undefined;
  
    const pieChartCard = cva(["grid", "h-full", "lg:relative", "lg:h-max"], {
      variants: {},
    });
    
    const container = cva(
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
      }
    )
  </script>
  
  <div
    class={container({ visible: Boolean($selectedHour.selectedHour) })}
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
  