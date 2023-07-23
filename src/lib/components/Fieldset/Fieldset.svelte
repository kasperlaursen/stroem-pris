<script lang="ts">
  import { cva } from "class-variance-authority";
  import { classFromProps } from "$lib/utils/classFromProps";
  import type { Direction } from "./types";

  export let direction: Direction = "stacked";
  const customClasses: string = classFromProps($$restProps);

  const fieldset = cva(["flex"], {
    variants: {
      direction: {
        stacked: "flex-col",
        inline: "flex-row items-center gap-2",
      },
    },
  });
</script>

<div
  {...$$restProps}
  class={`
        ${customClasses}
		${fieldset({ direction })}
    `}
>
  <slot />
</div>
