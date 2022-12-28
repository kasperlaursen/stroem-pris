<script lang="ts">
	import type { RowState } from './types';

	const customClasses = $$restProps.class;
	export let state: RowState = 'none';
	const stateClasses: { [key in RowState]: string } = {
		none: '',
		active: 'bg-neutral-300 bg-opacity-20 py-1 animate-pulse is-active',
		inactive: 'opacity-50'
	};
</script>

<div
	{...$$restProps}
	class={`${customClasses} group grid grid-cols-[max-content,max-content,auto] gap-4 px-4 items-center rounded ${stateClasses[state]}`}
>
	<slot />
</div>
