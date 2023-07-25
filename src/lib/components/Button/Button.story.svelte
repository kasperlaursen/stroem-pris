<script lang="ts">
  import Button from "./Button.svelte";
  import type { Hst as HstType } from "@histoire/plugin-svelte";
    import type { ButtonVariants } from "./types";
  export let Hst: HstType;

  let variant: ButtonVariants = "primary";

</script>

<Hst.Story>
  <Button {variant}>Button text</Button>
  <svelte:fragment slot="controls">
    <Hst.Select
      options={[
        { label: "primary", value: "primary" },
        { label: "ghost", value: "ghost" },
      ]}
      bind:value={variant}
      title="variant"
    />
  </svelte:fragment>
</Hst.Story>
