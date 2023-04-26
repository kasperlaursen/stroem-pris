<script lang="ts">
	import { cva } from 'class-variance-authority';
	import type { Colors } from './types';

	export let width = 0;
	export let color: Colors = 'neutral';

	const bar = cva(['h-full', 'rounded-full', 'bg-opacity-90', 'dark:bg-opacity-70'], {
		variants: {
			color: {
				neutral: 'bg-neutral-400',
				green: 'bg-emerald-500 dark:bg-emerald-500',
				red: 'bg-red-500 dark:bg-red-600',
				yellow: 'bg-amber-500 dark:bg-amber-500'
			}
		}
	});
</script>

<div
	class="w-full h-2 rounded-full bg-slate-500 dark:bg-opacity-30 bg-opacity-10 relative overflow-hidden"
>
	<div style={`width: ${100 * width}%`} class={bar({ color })} />
</div>
