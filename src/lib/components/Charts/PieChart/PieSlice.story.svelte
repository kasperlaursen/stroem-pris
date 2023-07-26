<script lang="ts">
  import PieSlice from "./PieSlice.svelte";
  import type { Hst as HstType } from "@histoire/plugin-svelte";
  export let Hst: HstType;

  let title = "My Title";
  let sliceLabel = "My label";
  let decimalValue = 0.5;
  let startAngle = 0;
  let chartSize = 400;
  let customClass = "fill-primary-600";

</script>

<Hst.Story title="PieSlice" group="PieChart">
  <svg viewBox={`0 0 ${chartSize} ${chartSize}`}>
    <PieSlice {title} {sliceLabel}  {decimalValue} {startAngle}  {chartSize} class={customClass} />
  </svg>
  <svelte:fragment slot="controls">
    <Hst.Text bind:value={title} title="title" />
    <Hst.Text bind:value={sliceLabel} title="sliceLabel" />
    <Hst.Text bind:value={customClass} title="class" />
    <Hst.Number bind:value={decimalValue} title="decimalValue" />
    <Hst.Number bind:value={startAngle} title="startAngle" />
    <Hst.Number bind:value={chartSize} title="chartSize" />
  </svelte:fragment>
</Hst.Story>
