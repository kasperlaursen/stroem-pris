<script lang="ts">
	import Widget from './Widget.svelte';
	const customClasses = $$restProps.class;
	export let totalUsage: number = 0;
	export let totalSpot: number = 0;
	import { fixed } from '$lib/stores';
	import { Input, P } from 'flowbite-svelte';
</script>

<Widget
	data={[
		{
			title: 'Total pris (fast)',
			value: ((totalUsage * $fixed) / 100).toFixed(2),
			unit: 'kr'
		},
		{
			title: 'Total pris (spot)',
			value: totalSpot.toFixed(2),
			unit: 'kr'
		},
		{
			title: 'Forskel',
			value: (totalUsage * ($fixed / 100) - totalSpot).toFixed(2),
			unit: 'kr',
			valueColor: totalUsage * ($fixed / 100) > totalSpot ? '!text-red-500' : '!text-emerald-500'
		}
	]}
	icon="🤑"
	class={`${customClasses} row-span-4`}
	{...$$restProps}
>
	<P weight="medium" class="opacity-60">Fast pris beregner</P>
	<div class="grid gap-2">
		<label class="text-xs" for="fixed">Fastpris uden afgifter og moms (øre/kwh)</label>
		<Input id="fixed" placeholder="Din fastpris" bind:value={$fixed} type="number" />
	</div>
</Widget>
