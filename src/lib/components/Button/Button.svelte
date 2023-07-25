<script lang="ts">
  import { classFromProps } from "$lib/utils/classFromProps";
    import { cva } from "class-variance-authority";
  import type { ButtonTypes, ButtonVariants } from "./types";

  const customClasses: string = classFromProps($$restProps);
  export let type: ButtonTypes = "button";
  export let variant: ButtonVariants = "primary";

  const button = cva(["text-sm","rounded","p-1","px-3","font-medium","transition"], {
    variants: {
      variant: {
        primary: ["text-primary-50", "bg-primary-500","hover:bg-primary-600"],
        ghost: ["text-primary-800", "hover:bg-neutral-200", "dark:text-primary-50", "hover:dark:bg-neutral-800"]
      }
    }
  })

</script>

<button
  on:click
  on:mouseover
  on:mouseenter
  on:mouseleave
  on:focus
  {...$$restProps}
  {type}
  class={button({class: customClasses, variant})}
>
  <slot />
</button>
