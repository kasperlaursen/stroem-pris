<script lang="ts">
	import SpotChart from '$lib/components/Charts/SpotChart/SpotChart.svelte';
	import Card from '$lib/components/Card/Card.svelte';
	import type { PageData } from './$types';
	import Alert from '$lib/components/Alert/Alert.svelte';
	import type { SpotChartData } from '$lib/components/Charts/SpotChart/types';
	import { spotDataToSpotChartEntries } from '$lib/utils/spotDataToSpotChartEntries';
	import { PRICE_MULTIPLIER } from '$lib/utils/constants';

	export let data: PageData;
	let { data: pageData, errors, session } = data;
	let { spotAverage, spotData, spotMax } = pageData;

	let spotChartData: SpotChartData | null = null;

	if (spotAverage && spotMax && spotData) {
		spotChartData = {
			average: spotAverage * PRICE_MULTIPLIER,
			max: spotMax * PRICE_MULTIPLIER * 1.1,
			entries: spotDataToSpotChartEntries({ spotData })
		};
	}
</script>

<h1 class="text-3xl font-bold uppercase">Welcome to Strømpris</h1>

{#each errors ?? [] as error}
	<Alert>{error.message}</Alert>
{/each}

{#if session}
	<form method="POST" action="/auth?/signout" class="grid gap-4">
		<button type="submit">Log ud</button>
	</form>
{:else}
	<a href="/auth">Log ind</a>
{/if}

<Card spacing="base">
	<div class="flex justify-between">
		<h1>Variabel strømpris i dag</h1>
	</div>
	{#if spotChartData}
		<SpotChart data={spotChartData} />
	{/if}
</Card>
