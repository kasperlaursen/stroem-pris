<script lang="ts">
  import { cva } from "class-variance-authority";

  import { classFromProps } from "$lib/utils/classFromProps";
  import { responsiveSpacingClasses } from "../utils/spacingClasses";
  import type { Spacing } from "./types";

  const customClasses: string = classFromProps($$restProps);

  const card = cva(
    [
      "grid",
      "rounded-md",
      "border-2",
      "bg-white",
      "dark:bg-neutral-800",
      "border-gray-100",
      "dark:border-neutral-900",
    ],
    {
      variants: {
        spacing: {
          base: responsiveSpacingClasses,
          none: "",
        },
      },
    },
  );

  export let spacing: Spacing = "base";
</script>

<div
  {...$$restProps}
  class={`
        ${customClasses}
        ${card({ spacing })}
    `}
>
  <slot />
</div>
