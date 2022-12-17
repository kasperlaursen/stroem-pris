<script lang="ts">
	import Link from '$lib/components/base/Link.svelte';
	import DailySpot from '$lib/components/charts/HourlyPriceChart/DailySpot.svelte';
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

	<Card class="!max-w-full gap-2 py-4" padding="none">
		<form method="get" action="/" class="flex gap-4 justify-center px-4">
			<Heading customSize="text-xl" class="font-medium text-lg ">Variabel strømpris</Heading>
			<div class="grid gap-4 grid-cols-2 justify-self-end shrink-0">
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
		<P class="!text-xs md:!text-sm px-4">
			Priserne vises uden Nettarif, som variere mellem netselskaber. <br />
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
