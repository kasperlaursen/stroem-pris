<script lang="ts">
	export let space: boolean = true;
	const customClasses = $$restProps.class;
</script>

<div
	{...$$restProps}
	class={`
    ${customClasses}
    ${space ? 'p-4 gap-4' : ''}
    grid
    w-full
    bg-white
    rounded-lg
    border
    border-gray-200
    dark:bg-gray-800
    dark:border-gray-700
  `}
>
	<slot />
</div>
