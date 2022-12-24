<script lang="ts">
	export let spacing: 'base' | 'none' = 'base';
	const customClasses = $$restProps.class;
</script>

<div
	{...$$restProps}
	class={`
        ${customClasses}
        ${spacing === 'base' ? 'p-4' : ''}
        rounded-md
        border-2
        bg-white
        dark:bg-neutral-800
        border-gray-100
        dark:border-neutral-600
    `}
>
	<slot />
</div>
