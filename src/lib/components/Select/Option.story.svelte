<script lang="ts">
  import Option from "./Option.svelte";
  import type { Hst as HstType } from "@histoire/plugin-svelte";
  export let Hst: HstType;
</script>

<Hst.Story>
  <Option value="value">Label</Option>
</Hst.Story>
