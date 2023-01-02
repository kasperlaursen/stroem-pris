<script lang="ts">
	import { DateTime } from 'luxon';
	import { onMount } from 'svelte';
	import { getColor, getPriceLabel, getState, getTimeLabel, getWidth } from './helpers';
	import SpotChartBar from './SpotChartBar.svelte';
	import SpotChartLabel from './SpotChartLabel.svelte';
	import SpotChartRow from './SpotChartRow.svelte';
	import SpotChartValue from './SpotChartValue.svelte';
	import type { SpotChartData } from './types';

	const customClasses = $$restProps.class;
	export let data: SpotChartData;

	let now = DateTime.now().setZone('Europe/Copenhagen');
	onMount(() => {
		setInterval(() => (now = DateTime.now().setZone('Europe/Copenhagen')), 60 * 1000);
	});
</script>

<div
	{...$$restProps}
	class={`${customClasses} grid text-xs md:text-sm select-none w-full p-4 font-mono cursor-default`}
>
	{#each data.entries as entry}
		<SpotChartRow
			state={getState({ now, time: entry.time })}
			title={`${getTimeLabel({ time: entry.time })}: ${entry.price} kr`}
		>
			<SpotChartLabel>{getTimeLabel({ time: entry.time })}</SpotChartLabel>
			<SpotChartValue>
				{getPriceLabel({ price: entry.price })}
			</SpotChartValue>
			<SpotChartBar
				width={getWidth({ current: entry.price, max: data.max })}
				color={getColor({ current: entry.price, average: data.average })}
			/>
		</SpotChartRow>
	{/each}
</div>
