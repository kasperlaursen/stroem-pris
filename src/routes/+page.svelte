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

	const selectedArea = data.priceArea;
	$: area = selectedArea;

	$: relativeDateFormatter = new Intl.RelativeTimeFormat('da-DK', {
		numeric: 'auto',
		style: 'narrow'
	});

	$: dateDiff = Math.ceil(
		(DateTime.fromISO(selectedDate).toMillis() - DateTime.now().toMillis()) / (1000 * 60 * 60 * 24)
	);

	const handleChange = (event: any) => {
		event.target.form.submit();
	};
</script>

<div class="grid gap-4">
	{#each data.errors as error}
		<Alert>{error.message}</Alert>
	{/each}

	<Card>
		<form method="get" action="/" class="flex justify-between">
			<h1 class="font-medium text-lg">
				Spot pris for {relativeDateFormatter.format(dateDiff, 'day')}
			</h1>
			<span>
				<input
					class="border-0 rounded bg-neutral-200 dark:bg-neutral-800 cursor-pointer"
					type="date"
					name="date"
					bind:value={date}
					on:change={handleChange}
					max={DateTime.now().plus({ days: 1 }).toISODate()}
				/>
				<select
					name="area"
					bind:value={data.priceArea}
					on:change={handleChange}
					class="border-0 rounded bg-neutral-200 dark:bg-neutral-800 cursor-pointer"
				>
					<option value="DK1">DK1</option>
					<option value="DK2">DK2</option>
				</select>
			</span>
		</form>
		<p>
			Priserne i grafen er uden Nettarif (også kaldet Transport) da denne varierer mellem
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
