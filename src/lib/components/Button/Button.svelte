<script lang="ts">
  import { classFromProps } from "$lib/utils/classFromProps";
  import type { ButtonTypes } from "./types";

  const customClasses: string = classFromProps($$restProps);
  export let type: ButtonTypes = "button";
</script>

<button
  on:click
  on:mouseover
  on:mouseenter
  on:mouseleave
  on:focus
  {...$$restProps}
  {type}
  class={`
        ${customClasses}
        text-sm
		rounded
		p-1
		px-3
		text-primary-50
		font-medium
		bg-primary-500
		hover:bg-primary-600
		transition
    `}
>
  <slot />
</button>
