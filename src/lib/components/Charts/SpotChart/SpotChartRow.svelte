<script lang="ts">
	import { cva } from 'class-variance-authority';
	import { classFromProps } from '$lib/utils/classFromProps';
	import type { RowState } from './types';

	const customClasses: string = classFromProps($$restProps);

	export let state: RowState = 'none';

	const row = cva(
		[
			'group',
			'grid',
			'grid-cols-[max-content,max-content,auto]',
			'gap-4',
			'px-2',
			'items-center',
			'rounded'
		],
		{
			variants: {
				state: {
					none: '',
					active: 'bg-neutral-300 bg-opacity-30 py-1 animate-pulse is-active',
					inactive: 'opacity-50'
				}
			}
		}
	);
</script>

<div
	{...$$restProps}
	data-state={state}
	class={`
		${customClasses}
		${row({ state })}
	`}
>
	<slot />
</div>
