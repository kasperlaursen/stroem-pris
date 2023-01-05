<script lang="ts">
	import type { RowState } from './types';

	const customClasses = $$restProps.class;
	export let state: RowState = 'none';
	const stateClasses: { [key in RowState]: string } = {
		none: '',
		active: 'bg-neutral-300 bg-opacity-30 py-1 animate-pulse is-active',
		inactive: 'opacity-50'
	};
</script>

<div
	{...$$restProps}
	class={`
		${customClasses ?? ''}
		${stateClasses[state]}
		group grid grid-cols-[max-content,max-content,auto] gap-4 px-2 items-center rounded 
	`}
>
	<slot />
</div>
