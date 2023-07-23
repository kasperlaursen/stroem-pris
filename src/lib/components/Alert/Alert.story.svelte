<script lang="ts">
  import Alert from "./Alert.svelte";
  import type { Hst as HstType } from "@histoire/plugin-svelte";
  import type { Intent } from "./types";
  export let Hst: HstType;

  let title = "Alert title";
  let content =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt assumenda quia ad cupiditate culpa recusandae provident aperiam aliquam vero! Dolorem.";
  let intent: Intent = "danger";
</script>

<Hst.Story>
  <div class="grid gap-4">
    <Alert {title} {intent}>
      {content}
    </Alert>
  </div>
  <svelte:fragment slot="controls">
    <Hst.Text bind:value={title} title="Title" />
    <Hst.Text bind:value={content} title="Content" />
    <Hst.Select
      options={[
        { label: "info", value: "info" },
        { label: "warning", value: "warning" },
        { label: "danger", value: "danger" },
        { label: "neutral", value: "neutral" },
      ]}
      bind:value={intent}
      title="Intent"
    />
  </svelte:fragment>
</Hst.Story>
