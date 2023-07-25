<script lang="ts">
  import { browser } from "$app/environment";
  import { classFromProps } from "$lib/utils/classFromProps";
  import { DateTime } from "luxon";
  import { onMount } from "svelte";
  import {
    getColor,
    getPriceLabel,
    getState,
    getTimeLabel,
    getWidth,
  } from "./helpers";
  import SpotChartBar from "./SpotChartBar.svelte";
  import SpotChartLabel from "./SpotChartLabel.svelte";
  import SpotChartRow from "./SpotChartRow.svelte";
  import SpotChartValue from "./SpotChartValue.svelte";
  import { selectedHour } from "$lib/stores/selectedHourStore";
  import type { SpotChartData } from "./types";

  const customClasses: string = classFromProps($$restProps);
  export let data: SpotChartData;
  export let showDayDivider = true;
  export let autoScroll = false;

  let now = DateTime.now().setZone("Europe/Copenhagen");

  const scrollToActive = () => {
    if (browser && autoScroll) {
      document
        .querySelector('#spotCard [data-state="active"]')
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const onHourChange = () => {
    scrollToActive();
    now = DateTime.now().setZone("Europe/Copenhagen");
  };

  const msToNextHour =
    DateTime.fromObject({
      year: now.year,
      month: now.month,
      day: now.day,
      hour: now.hour + 1,
    }).diffNow("milliseconds").milliseconds + 5;

  onMount(() => {
    scrollToActive();

    setTimeout(() => {
      now = DateTime.now().setZone("Europe/Copenhagen");
      setInterval(() => onHourChange(), 60 * 60 * 1000);
    }, msToNextHour);
  });
</script>

<div
  {...$$restProps}
  class={`${customClasses} grid text-xs md:text-sm select-none w-full font-mono cursor-default`}
  id="spotCard"
>
  {#each data.entries as { time, price }}
    <SpotChartRow
      state={getState({
        now,
        time: time,
        selected: $selectedHour.selectedHour,
      })}
      title={`${getTimeLabel({ time: time })}: ${price} kr`}
      onClick={() => {
        selectedHour.set({ selectedHour: time });
      }}
    >
      <SpotChartLabel>{getTimeLabel({ time: time })}</SpotChartLabel>
      <SpotChartValue>
        {getPriceLabel({ price: price })}
      </SpotChartValue>
      <SpotChartBar
        width={getWidth({ current: price, max: data.max })}
        color={getColor({ current: price, average: data.average })}
      />
    </SpotChartRow>
    {#if showDayDivider && time.hour === 0}
      <SpotChartLabel class="m-2 h-px bg-current opacity-30" />
    {/if}
  {/each}
</div>
