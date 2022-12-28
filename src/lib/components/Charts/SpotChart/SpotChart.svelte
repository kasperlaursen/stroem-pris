<script lang="ts">
	import { DateTime } from 'luxon';
	import { onMount } from 'svelte';
	import { getColor, getState, getWidth } from './helpers';
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
		<SpotChartRow state={getState({ now, time: entry.time })}>
			<SpotChartLabel>{entry.time.toFormat('kl. HH')}</SpotChartLabel>
			<SpotChartValue>
				{entry.price.toLocaleString('da-DK', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				})} kr
			</SpotChartValue>
			<SpotChartBar
				width={getWidth({ current: entry.price, max: data.max })}
				color={getColor({ current: entry.price, average: data.average })}
			/>
		</SpotChartRow>
	{/each}
</div>
