<script lang="ts">
	import { page } from '$app/stores';
	import SpotChart from '$lib/components/Charts/SpotChart/SpotChart.svelte';
	import Card from '$lib/components/Card/Card.svelte';
	import type { PageData } from './$types';
	import { DateTime } from 'luxon';

	export let data: PageData;
	let { spotData } = data;
</script>

<h1 class="text-3xl font-bold uppercase">Welcome to Strømpris</h1>

{#if $page.data.session}
	<form method="POST" action="/auth?/signout" class="grid gap-4">
		<button type="submit">Log ud</button>
	</form>
{:else}
	<a href="/auth">Log ind</a>
{/if}

<Card>
	<SpotChart
		data={{
			average: 1,
			max: 1.1,
			entries: spotData
				? spotData
						.map(({ hourUTC, priceDKK }) => ({
							price: priceDKK / 1000,
							time: DateTime.fromJSDate(hourUTC)
						}))
						.reverse()
				: []
		}}
	/>
</Card>
