<script lang="ts">
	import { classFromProps } from '$lib/utils/classFromProps';
	import { responsiveSpacingClasses } from '../utils/spacingClasses';
	import type { Spacing } from './types';

	const customClasses: string = classFromProps($$restProps);

	export let spacing: Spacing = 'base';
</script>

<div
	{...$$restProps}
	class={`
        ${customClasses}
        ${spacing === 'base' ? responsiveSpacingClasses : ''}
        grid
        rounded-md
        border-2
        bg-white
        dark:bg-neutral-800
        border-gray-100
        dark:border-neutral-900
    `}
>
	<slot />
</div>
