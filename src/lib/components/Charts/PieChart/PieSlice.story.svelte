<script lang="ts">
  import PieSlice from "./PieSlice.svelte";
  import type { Hst as HstType } from "@histoire/plugin-svelte";
  export let Hst: HstType;
</script>

<Hst.Story title="PieSlice" group="PieChart">
  <PieSlice title="My Title" decimalValue={0.5} startAngle={0} />
</Hst.Story>
