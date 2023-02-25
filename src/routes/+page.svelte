<script lang="ts">
	import SpotChart from '$lib/components/Charts/SpotChart/SpotChart.svelte';
	import Card from '$lib/components/Card/Card.svelte';
	import type { PageData } from './$types';
	import type { SpotChartData } from '$lib/components/Charts/SpotChart/types';
	import { spotDataToSpotChartEntries } from '$lib/utils/spotDataToSpotChartEntries';
	import { PRICE_MULTIPLIER } from '$lib/utils/constants';
	import { onMount } from 'svelte';
	import ErrorList from '$lib/ui/ErrorList/ErrorList.svelte';
	import PriceAreaForm from './PriceAreaForm.svelte';

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

	onMount(() => {
		document
			.querySelector('#spotCard [data-state="active"]')
			?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	});
</script>

<div class="max-h-full overflow-hidden grid grid-rows-[auto_auto_1fr]">
	<ErrorList {errors} />
	<div class="flex justify-between items-center p-2">
		<h1 class="font-medium text-gray-800 dark:text-gray-200">Variabel Strømpris</h1>
		<PriceAreaForm {area} />
	</div>
	<div class="overflow-hidden">
		<Card spacing="base" class="overflow-y-auto mb-2 max-h-full" id="spotCard">
			{#if spotChartData}
				<SpotChart data={spotChartData} />
			{/if}
		</Card>
	</div>
</div>
