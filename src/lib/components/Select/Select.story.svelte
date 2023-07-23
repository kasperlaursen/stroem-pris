<script lang="ts">
  import Select from "./Select.svelte";
  import Option from "./Option.svelte";
  import type { Hst as HstType } from "@histoire/plugin-svelte";
  export let Hst: HstType;

  let selected = "";
</script>

<Hst.Story>
  <Select bind:value={selected}>
    <Option value="" disabled selected>Select a value</Option>
    <Option value="value1">Label 1</Option>
    <Option value="value2">Label 2</Option>
  </Select>
</Hst.Story>
