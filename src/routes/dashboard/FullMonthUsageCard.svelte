<script lang="ts">
	import PriceUsageChart from '$lib/components/charts/PriceUsageChart.svelte';
	import { Card, Heading } from 'flowbite-svelte';
	import type { DateTime } from 'luxon';

	export let data: { price: number | null; usage: number | null; hour: DateTime }[];
</script>

<Card class="min-w-full gap-4" padding="none">
	<div class="flex justify-between p-8 pb-0">
		<Heading customSize="text-lg font-semibold">Månedens total forbrug pr. dag</Heading>
	</div>
	<PriceUsageChart
		data={data.map(({ hour, price, usage }) => ({
			price,
			usage,
			label: hour.toFormat('dd / MM')
		}))}
	/>
</Card>
