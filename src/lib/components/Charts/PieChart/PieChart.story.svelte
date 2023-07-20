<script lang="ts">
	import PieChart from './PieChart.svelte';
	import type { Hst as HstType } from '@histoire/plugin-svelte';
	import type { PieChartData } from './types';
	export let Hst: HstType;

	let data: PieChartData[] = [
		{value: 6, label:"label 1", color: "fill-primary-500"},
		{value: 4, label:"label 2", color: "fill-red-500" },
		{value: 2, label:"label 3", color: "fill-yellow-500" },
		{value: 2, label:"label 4", color: "fill-orange-500" } 
	];
</script>

<Hst.Story title="PieChart" group="PieChart">
	<PieChart {data} />
	<svelte:fragment slot="controls">
		<Hst.Json bind:value={data} title="Data" />
	</svelte:fragment>
</Hst.Story>
