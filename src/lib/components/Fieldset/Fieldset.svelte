<script lang="ts">
	import { classFromProps } from '$lib/utils/classFromProps';
	import type { Direction } from './types';
	export let direction: Direction = 'stacked';
	const customClasses: string = classFromProps($$restProps);
	const directionMap = {
		stacked: 'flex-col',
		inline: 'flex-row items-center gap-2'
	};
</script>

<div
	{...$$restProps}
	class={`
        ${customClasses}
		${directionMap[direction]}
        flex
    `}
>
	<slot />
</div>
