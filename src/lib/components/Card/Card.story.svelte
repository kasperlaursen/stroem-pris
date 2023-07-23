<script lang="ts">
  import Card from "./Card.svelte";
  import type { Hst as HstType } from "@histoire/plugin-svelte";
  import type { Spacing } from "./types";
  export let Hst: HstType;

  let spacing: Spacing = "base";
</script>

<Hst.Story>
  <Card {spacing}>Card Content</Card>
  <svelte:fragment slot="controls">
    <Hst.Select
      options={[
        { label: "base", value: "base" },
        { label: "none", value: "none" },
      ]}
      bind:value={spacing}
      title="Spacing"
    />
  </svelte:fragment>
</Hst.Story>
