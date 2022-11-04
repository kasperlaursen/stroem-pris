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
    rounded-2xl
    border
    bg-white
    border-gray-200
    dark:textbg-slate-50
    dark:bg-neutral-900
    dark:border-neutral-800
  `}
>
	<slot />
</div>
