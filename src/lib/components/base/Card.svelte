<script lang="ts">
	export let space: boolean = true;
	export let icon: string = '';
	const customClasses = $$restProps.class;
</script>

<div
	{...$$restProps}
	class={`
    ${customClasses}
    ${space ? 'p-4 gap-4' : ''}
    grid
    place-content-start
    w-full
    relative
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
	{#if icon}
		<div class={`absolute top-2 right-4`}>{icon}</div>
	{/if}
</div>
