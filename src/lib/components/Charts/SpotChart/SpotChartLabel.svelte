<script lang="ts">
  import { classFromProps } from "$lib/utils/classFromProps";

  const customClasses: string = classFromProps($$restProps);
</script>

<span
  {...$$restProps}
  class={`${customClasses} dark:text-gray-400 text-gray-500`}><slot /></span
>
