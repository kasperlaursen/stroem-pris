<script lang="ts">
  import { classFromProps } from "$lib/utils/classFromProps";
  import type { InternalError } from "$lib/types/InternalResponse";
  import Alert from "$lib/components/Alert/Alert.svelte";

  const customClasses: string = classFromProps($$restProps);

  export let errors: InternalError[] = [];
</script>

<div {...$$restProps} class={`${customClasses} grid gap-4`}>
  {#each errors as error}
    <Alert>{error.message}</Alert>
  {/each}
</div>
