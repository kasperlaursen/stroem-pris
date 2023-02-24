<script lang="ts">
	import SpotChart from '$lib/components/Charts/SpotChart/SpotChart.svelte';
	import Card from '$lib/components/Card/Card.svelte';
	import type { PageData } from './$types';
	import Alert from '$lib/components/Alert/Alert.svelte';
	import type { SpotChartData } from '$lib/components/Charts/SpotChart/types';
	import { spotDataToSpotChartEntries } from '$lib/utils/spotDataToSpotChartEntries';
	import { PRICE_MULTIPLIER } from '$lib/utils/constants';
	import Option from '$lib/components/Select/Option.svelte';
	import Select from '$lib/components/Select/Select.svelte';

	export let data: PageData;
	let { data: pageData, errors, area } = data;
	let { spotAverage, spotData, spotMax } = pageData;

	let spotChartData: SpotChartData | null = null;

	if (spotAverage && spotMax && spotData) {
		spotChartData = {
			average: spotAverage * PRICE_MULTIPLIER,
			max: spotMax * PRICE_MULTIPLIER * 1.1,
			entries: spotDataToSpotChartEntries({ spotData })
		};
	}
	let areaForm: HTMLFormElement;
	const handleChange = () => {
		areaForm.submit();
	};
</script>

{#each errors ?? [] as error}
	<Alert>{error.message}</Alert>
{/each}

<div class="flex justify-between items-center p-2">
	<h1 class="font-medium text-gray-800 dark:text-gray-200">Variabel Strømpris</h1>
	<form method="get" action="/" data-sveltekit-reload bind:this={areaForm}>
		<Select id="area" name="area" bind:value={area} on:change={handleChange}>
			<Option value="DK1">Vest for storebælt</Option>
			<Option value="DK2">Øst for storebælt</Option>
		</Select>
	</form>
</div>

<Card spacing="base">
	{#if spotChartData}
		<SpotChart data={spotChartData} />
	{/if}
</Card>
