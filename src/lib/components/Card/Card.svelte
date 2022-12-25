<script lang="ts">
	import type { Spacing } from './types';

	const customClasses = $$restProps.class;

	export let spacing: Spacing = 'base';
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
