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
    rounded-lg
    border
    bg-white
    border-gray-200
    dark:textbg-slate-50
    dark:bg-neutral-800
    dark:border-neutral-700
  `}
>
	<slot />
</div>
