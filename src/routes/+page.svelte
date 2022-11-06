<script lang="ts">
	import Alert from '$lib/components/base/Alert.svelte';
	import Card from '$lib/components/base/Card.svelte';
	import Link from '$lib/components/base/Link.svelte';
	import DailySpot from '$lib/components/charts/DailySpot.svelte';
	import type { PageData } from '.svelte-kit/types/src/routes/$types';
	import { DateTime } from 'luxon';

	export let data: PageData;
	const selectedDate = data.date;

	$: date = selectedDate;

	const handleChange = (event: any) => {
		event.target.form.submit();
	};
</script>

<div class="grid gap-4">
	{#each data.errors as error}
		<Alert>{error.message}</Alert>
	{/each}

	<Card>
		<div class="flex justify-between">
			<h1 class="font-medium text-lg">
				<form method="get">
					Spot pris for
					<input
						class="border-0 rounded bg-neutral-200 dark:bg-neutral-800 p-1 cursor-pointer"
						type="date"
						name="date"
						bind:value={date}
						on:change={handleChange}
						max={DateTime.now().plus({ days: 1 }).toISODate()}
					/>
					<input hidden name="area" bind:value={data.priceArea} />
				</form>
			</h1>
			<span>
				<Link color={data.priceArea === 'DK1' ? 'PRIMARY' : 'SECONDARY'} href="?area=DK1">DK1</Link>
				<Link color={data.priceArea === 'DK2' ? 'PRIMARY' : 'SECONDARY'} href="?area=DK2">DK2</Link>
			</span>
		</div>
		<p>
			Priserne i grafen er uden Nettarif (også kaldet Transport) da denne variere mellem
			netselskaber.
			<br />
			Du kan se hvilket netselskab du har på
			<Link href="https://www.danskenergi.dk/vejledning/nettilslutning/find-netselskab">
				Danskenergi.dk
			</Link>
		</p>
		{#if data.spotToday}
			<DailySpot spotData={data.spotToday} feeData={data.feesToday} />
		{/if}
	</Card>
</div>
