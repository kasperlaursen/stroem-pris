<script lang="ts">
  import Button from "./Button.svelte";
  import type { Hst as HstType } from "@histoire/plugin-svelte";
  export let Hst: HstType;
</script>

<Hst.Story>
  <Button>Button text</Button>
</Hst.Story>
