<script lang="ts">
	import SpotChart from '$lib/components/Charts/SpotChart/SpotChart.svelte';
	import Card from '$lib/components/Card/Card.svelte';
	import type { PageData } from './$types';
	import Alert from '$lib/components/Alert/Alert.svelte';
	import type { SpotChartData } from '$lib/components/Charts/SpotChart/types';
	import { spotDataToSpotChartEntries } from '$lib/utils/spotDataToSpotChartEntries';
	import { PRICE_MULTIPLIER } from '$lib/utils/constants';
	import Logo from '$lib/ui/Logo/Logo.svelte';
	import Option from '$lib/components/Select/Option.svelte';
	import Select from '$lib/components/Select/Select.svelte';

	export let data: PageData;
	let { data: pageData, errors, session, area } = data;
	let { spotAverage, spotData, spotMax } = pageData;

	let spotChartData: SpotChartData | null = null;

	if (spotAverage && spotMax && spotData) {
		spotChartData = {
			average: spotAverage * PRICE_MULTIPLIER,
			max: spotMax * PRICE_MULTIPLIER * 1.1,
			entries: spotDataToSpotChartEntries({ spotData })
		};
	}

	const handleChange = (event: any) => {
		console.log(event);
		event.target.form.submit();
	};
</script>

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
	<div class="flex justify-between items-center">
		<h1>Variabel strømpris</h1>
		<form method="get" action="/" data-sveltekit-reload>
			<Select id="area" name="area" bind:value={area} on:change={handleChange}>
				<Option value="DK1">Vest for storebælt</Option>
				<Option value="DK2">Øst for storebælt</Option>
			</Select>
		</form>
	</div>
	{#if spotChartData}
		<SpotChart data={spotChartData} />
	{/if}
</Card>
