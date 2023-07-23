<script lang="ts">
  import { cva } from "class-variance-authority";
  import { classFromProps } from "$lib/utils/classFromProps";
  const customClasses: string = classFromProps($$restProps);

  export let disabled = false;
  export let checked: boolean;

  const thumb = cva(
    [
      "transition-all",
      "duration-300",
      "ease-in-out",
      "absolute",
      "top-0",
      "left-0",
      "w-6",
      "h-6",
      "bg-white",
      "border-2",
      "border-gray-600",
      "rounded-full",
    ],
    {
      variants: {
        disabled: {
          true: ["bg-gray-100", "border-gray-500"],
          false: [""],
        },
        checked: {
          true: ["transform", "translate-x-full", "border-primary-500"],
          false: [""],
        },
      },
    },
  );
</script>

<div class={thumb({ disabled, checked, class: customClasses })} />
