<script lang="ts">
	import Link from '$lib/components/base/Link.svelte';
	import DailySpot from '$lib/components/charts/DailySpot.svelte';
	import type { PageData } from '.svelte-kit/types/src/routes/$types';
	import { Card, Input, Select, Alert, P, Heading } from 'flowbite-svelte';
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

	const areaOptions = [
		{ value: 'DK1', name: 'Vest for storebælt' },
		{ value: 'DK2', name: 'Øst for storebælt' }
	];
</script>

<div class="grid gap-4">
	{#each data.errors as error}
		<Alert color="red">{error.message}</Alert>
	{/each}

	{#if data.message}
		<Alert>{data.message}</Alert>
	{/if}

	<Card class="!max-w-full gap-4">
		<form method="get" action="/" class="grid md:grid-cols-2 gap-4 justify-center">
			<Heading customSize="text-xl" class="font-medium text-lg text-center md:text-start">
				Spot pris for {relativeDateFormatter.format(dateDiff, 'day')}
			</Heading>
			<div class="grid gap-4 grid-cols-2 justify-self-end">
				<Input
					class="!text-base !leading-4"
					size="sm"
					type="date"
					name="date"
					bind:value={date}
					on:change={handleChange}
					max={DateTime.now().plus({ days: 1 }).toISODate()}
				/>
				<Select
					size="sm"
					class="pr-8"
					id="area"
					name="area"
					items={areaOptions}
					placeholder="Område"
					bind:value={data.priceArea}
					on:change={handleChange}
				/>
			</div>
		</form>
		<P class="text-sm">
			Priserne i grafen er uden Nettarif (også kaldet Transport) da denne varierer mellem
			netselskaber.
			<br />
			Du kan se hvilket netselskab du har på
			<Link href="https://www.danskenergi.dk/vejledning/nettilslutning/find-netselskab">
				Danskenergi.dk
			</Link>
		</P>
		{#if data.spotToday}
			<DailySpot spotData={data.spotToday} feeData={data.feesToday} />
		{/if}
	</Card>
</div>
