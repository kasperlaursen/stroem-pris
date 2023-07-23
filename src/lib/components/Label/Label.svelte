<script lang="ts">
  import { classFromProps } from "$lib/utils/classFromProps";

  const customClasses: string = classFromProps($$restProps);
  export let htmlFor = "";
</script>

<label
  {...$$restProps}
  for={htmlFor}
  class={`
        ${customClasses}
        text-sm
        m-1
    `}
>
  <slot />
</label>
