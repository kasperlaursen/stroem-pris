<script lang="ts">
	import Link from '$lib/components/base/Link.svelte';
	import DailySpot from '$lib/components/charts/HourlyPriceChart/DailySpot.svelte';
	import type { PageData } from '.svelte-kit/types/src/routes/$types';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { AdjustmentsHorizontal, InformationCircle } from '@steeze-ui/heroicons';
	import { Card, Input, Select, Alert, P, Heading, Tooltip } from 'flowbite-svelte';
	import { DateTime } from 'luxon';

	export let data: PageData;

	const selectedDate = data.date;
	$: date = selectedDate;

	const handleChange = (event: any) => {
		event.target.form.submit();
	};

	const areaOptions = [
		{ value: 'DK1', name: 'Vest for storebælt' },
		{ value: 'DK2', name: 'Øst for storebælt' }
	];

	let isOpen = false;
	function toggle() {
		isOpen = !isOpen;
	}
</script>

<div class="grid gap-4">
	{#each data.errors as error}
		<Alert color="red">{error.message}</Alert>
	{/each}

	{#if data.message}
		<Alert>{data.message}</Alert>
	{/if}

	<Card class="!max-w-full gap-2 py-4" padding="none">
		<form method="get" action="/" class="grid md:flex gap-4 items-center px-4 relative">
			<Heading customSize="text-xl" class="font-medium text-lg flex items-center">
				Variabel strømpris
				<Icon id="info" src={InformationCircle} class={`m-1 h-4 w-4 cursor-pointer`} />
				<Tooltip triggeredBy="#info">
					<P class="!text-xs md:!text-sm px-4">
						Priserne vises uden Nettarif, som variere mellem netselskaber. <br />
						Du kan se hvilket netselskab du har på
						<Link href="https://www.danskenergi.dk/vejledning/nettilslutning/find-netselskab">
							Danskenergi.dk
						</Link>
					</P>
				</Tooltip></Heading
			>
			<span class="absolute right-4 top-0 md:hidden" on:keydown on:click={toggle}>
				<Icon src={AdjustmentsHorizontal} class={`h-6 w-6 cursor-pointer`} />
			</span>
			<div
				class={`grid gap-4 grid-cols-2 justify-self-end shrink-0 overflow-hidden transition-all ${
					isOpen ? 'h-full' : '!h-0 md:!h-full'
				}`}
			>
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
		<div class="flex gap-4 flex-col sm:flex-row-reverse">
			{#if data.spotTomorrow && data.spotTomorrow.length > 0}
				<DailySpot
					spotData={data.spotTomorrow}
					feeData={data.feesToday}
					averageLast30Days={data.averageLast30Days}
				/>
			{/if}

			{#if data.spotToday && data.spotToday.length > 0}
				<DailySpot
					spotData={data.spotToday}
					feeData={data.feesToday}
					averageLast30Days={data.averageLast30Days}
				/>
			{/if}
		</div>
	</Card>
</div>
