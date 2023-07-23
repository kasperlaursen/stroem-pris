<script lang="ts">
  import { classFromProps } from "$lib/utils/classFromProps";
  import type { InputTypes } from "./types";

  const customClasses: string = classFromProps($$restProps);
  export let type: InputTypes;
</script>

<input
  {...$$restProps}
  {type}
  on:change
  on:input
  on:keydown
  on:keypress
  on:keyup
  on:click
  on:focus
  on:blur
  class={`
        ${customClasses}
        text-sm
        py-1
        px-2
        m-1
        rounded-md
        border
        bg-white
        dark:bg-neutral-800
        border-gray-300
        dark:border-gray-600
        focus:ring-2
        focus:border-primary-500 
        focus:ring-primary-500
    `}
/>
