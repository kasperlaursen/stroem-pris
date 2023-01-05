<script lang="ts">
	import { responsiveSpacingClasses } from '../utils/spacingClasses';
	import type { Spacing } from './types';

	const customClasses = $$restProps.class;

	export let spacing: Spacing = 'base';
</script>

<div
	{...$$restProps}
	class={`
        ${customClasses ?? ''}
        ${spacing === 'base' ? 'p-4 gap-4' : ''}
        ${responsiveSpacingClasses}
        grid
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
