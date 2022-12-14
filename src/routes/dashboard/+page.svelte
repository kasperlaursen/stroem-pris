<script lang="ts">
	import Widget from '$lib/components/widget/Widget.svelte';
	import type { PageData } from '.svelte-kit/types/src/routes/dashboard/$types';
	import { DateTime } from 'luxon';
	import { Heading, Select, Alert, Button, Drawer, Toggle, Input, Label } from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import { getCurrentFeeByDateAndKey } from '$lib/utils/fees';
	import DailyUsageChartCard from './DailyUsageChartCard.svelte';
	import MonthAverageChartCard from './MonthAverageChartCard.svelte';
	import FullMonthUsageCard from './FullMonthUsageCard.svelte';
	import Link from '$lib/components/base/Link.svelte';
	import { enhance } from '$app/forms';

	let drawerHidden = true;
	let transitionParams = {
		x: 320,
		duration: 200,
		easing: sineIn
	};

	export let data: PageData;
	let {
		errors,
		month,
		year,
		priceArea,
		spotData,
		usageMeterData,
		feesData,
		elafgift,
		tariffer,
		fixedPrice,
		flexFee,
		moms,
		usagePriceHourAndCalcualtions
	} = data;

	let compareFixedKwhPrice = fixedPrice ?? 0;
	let compareVariableFeeKwh = flexFee ?? 0;

	const hours = [...Array(24).keys()] as const;

	$: spotAveragePrice =
		usagePriceHourAndCalcualtions.reduce((acc, { price }) => acc + (price ?? 0), 0) /
		usagePriceHourAndCalcualtions?.length;

	$: totalUsage = usagePriceHourAndCalcualtions.reduce((acc, { usage }) => acc + usage, 0);

	$: usageSpotAveragePrice = () =>
		usagePriceHourAndCalcualtions.reduce((acc, { hourTotal }) => acc + hourTotal, 0) / totalUsage;

	$: spotDataCount = spotData.length;
	$: spotDataLatestDate = DateTime.fromMillis(
		Math.max(
			...spotData.map(({ hourUTC }) => DateTime.fromISO(hourUTC, { zone: 'utc' }).toMillis())
		)
	).toLocaleString(DateTime.DATETIME_MED, { locale: 'da-DK' });

	$: usageMeterDataCount = usageMeterData.length;
	$: usageMeterDataLatestDate = DateTime.fromMillis(
		Math.max(
			...usageMeterData.map(({ hourUTC }) => DateTime.fromISO(hourUTC, { zone: 'utc' }).toMillis())
		)
	).toLocaleString(DateTime.DATETIME_MED, { locale: 'da-DK' });

	const lowestUsageMeterData =
		usageMeterData
			.map(({ measurement }) => measurement)
			.filter(Boolean)
			.sort((a, b) => a - b)
			.slice(0, usageMeterData.length / 24)
			.reduce((acc, measurement) => acc + measurement, 0) /
		(usageMeterData.length / 24);

	const highestUsageMeterData =
		usageMeterData
			.map(({ measurement }) => measurement)
			.filter(Boolean)
			.sort((a, b) => a - b)
			.reverse()
			.slice(0, usageMeterData.length / 24)
			.reduce((acc, measurement) => acc + measurement, 0) /
		(usageMeterData.length / 24);

	$: totalUsageSpotPrice = () =>
		usagePriceHourAndCalcualtions.reduce((acc, { hourTotal }) => acc + hourTotal, 0);

	$: totalUsageFixedPrice = () =>
		usagePriceHourAndCalcualtions.reduce(
			(acc, { fixedPrice, usage }) => acc + fixedPrice * usage,
			0
		);

	const handleChange = (event: any) => {
		event.target.form.submit();
	};

	const months = [...Array(DateTime.now().month).keys()].map((index) =>
		DateTime.fromObject({ month: index + 1 }).toFormat('MMMM', {
			locale: 'da-DK'
		})
	);
	let monthNumber = String(month);
	const monthOptions = months.map((name, index) => ({ value: String(index + 1), name }));

	const areaOptions = [
		{ value: 'DK1', name: 'Vest for storebælt' },
		{ value: 'DK2', name: 'Øst for storebælt' }
	];

	$: getMessage = () => {
		const parts = [];
		if (moms) parts.push('Moms');
		if (elafgift) parts.push('Afgift');
		if (tariffer) parts.push('Tariffer');
		let last;
		if (parts.length > 1) {
			last = parts.pop();
		}
		return `Alle priser vises inklusiv ${parts.join(', ')} ${last ? ` og ${last}` : ''}`;
	};
</script>

<div class="grid gap-4">
	{#each errors as error}
		<Alert>{error.message}</Alert>
	{/each}
	<section class="flex justify-between flex-col sm:flex-row gap-4">
		<Heading customSize="text-2xl font-bold" class="capitalize">
			🗓️ {DateTime.fromObject({ month: month }).toFormat('MMMM y', {
				locale: 'da-DK'
			})}
		</Heading>
		<form method="get" action="?/" class="flex gap-4 grow">
			<Select
				size="sm"
				class="pr-8 w-60"
				id="area"
				name="area"
				items={areaOptions}
				placeholder="Område"
				value={priceArea}
				on:change={handleChange}
			/>
			<Select
				size="sm"
				id="month"
				name="month"
				class="pr-8 capitalize"
				items={monthOptions}
				placeholder="Måned"
				bind:value={monthNumber}
				on:change={handleChange}
			/>
			<Button color="dark" on:click={() => (drawerHidden = !drawerHidden)}>⚙️</Button>
		</form>
	</section>
	<Drawer
		transitionType="fly"
		{transitionParams}
		bind:hidden={drawerHidden}
		placement="right"
		id="settingsDrawer"
	>
		<div class="flex justify-between items-center mb-4">
			<Heading tag="h5">Visnings indstillinger</Heading>
			<Button color="dark" class="place-self-end" on:click={() => (drawerHidden = !drawerHidden)}>
				X
			</Button>
		</div>
		<form class="grid gap-4" method="POST" action="?/updateMonthlySettings" use:enhance>
			<input type="hidden" bind:value={month} name="month" />
			<input type="hidden" bind:value={year} name="year" />
			<Heading tag="h6" class="mt-4">Fast pris</Heading>
			<Label class="text-xs" for="fixed">Fastpris uden afgifter og moms (øre/kwh)</Label>
			<Input
				id="fixedPrice"
				name="fixedPrice"
				placeholder="Fastpris pr. kwh"
				bind:value={compareFixedKwhPrice}
				type="number"
			/>
			<Button type="submit" class="w-max place-self-end">Gem pris</Button>
		</form>
		<form class="grid gap-4" method="POST" action="?/updateMonthlySettings" use:enhance>
			<input type="hidden" bind:value={month} name="month" />
			<input type="hidden" bind:value={year} name="year" />
			<Heading tag="h6" class="mt-4">Variabel med gebyr</Heading>
			<Label class="text-xs" for="feePrice">Gebyr pr. kwh uden moms (øre/kwh)</Label>
			<Input
				step="0.1"
				id="feePrice"
				name="feePrice"
				placeholder="Gebyr pr. kwh"
				bind:value={compareVariableFeeKwh}
				type="number"
			/>
			<Button type="submit" class="w-max place-self-end">Gem gebyr</Button>
		</form>
		<Heading tag="h6" class="mt-4">Transport</Heading>
	</Drawer>

	{#if moms || elafgift || tariffer}
		<Alert color="dark" class="flex items-between w-full">
			<div class="flex gap-2">
				{getMessage()}
				<Link href="/settings">Rediger indstillinger</Link>
			</div>
		</Alert>
	{/if}
	<section
		class=" widget-grid grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 max-w-full"
	>
		<Widget
			data={{
				title: 'Dit Forbrug',
				value: totalUsage.toFixed(2),
				unit: 'kwh'
			}}
			icon="🔌"
		/>

		<Widget
			data={{
				title: 'Total variabel pris',
				value: totalUsageSpotPrice().toFixed(2),
				unit: `kr `
			}}
			icon="💰"
		/>

		<Widget
			data={{
				title: 'Dit variabel gennemsnit kr/kwh',
				value: usageSpotAveragePrice().toFixed(2),
				unit: 'kr/kwh'
			}}
			icon="💸"
		/>

		<Widget
			data={{
				title: 'Gennemsnit variabel kr/kwh',
				value: spotAveragePrice.toFixed(2),
				unit: 'kr/kwh'
			}}
			icon="📈"
		/>

		<Widget
			data={{
				title: 'Laveste time gennemsnit',
				value: lowestUsageMeterData.toFixed(2),
				unit: 'kwh'
			}}
			icon="💤"
		/>

		<Widget
			data={{
				title: 'Højeste time gennemsnit',
				value: highestUsageMeterData.toFixed(2),
				unit: 'kwh'
			}}
			icon="😱"
		/>

		<Widget
			data={[
				{
					title: 'Total pris (fast)',
					value: compareFixedKwhPrice
						? totalUsageFixedPrice().toFixed(2)
						: 'Klik ⚙️ for opsætning.',
					unit: compareFixedKwhPrice ? 'kr' : ''
				},
				{
					title: 'Total pris (variabel)',
					value: totalUsageSpotPrice().toFixed(2),
					unit: 'kr'
				},
				{
					title: 'Forskel',
					value: (totalUsageFixedPrice() - totalUsageSpotPrice()).toFixed(2),
					unit: 'kr',
					valueColor:
						totalUsageFixedPrice() / 100 > totalUsageSpotPrice()
							? '!text-red-500'
							: '!text-emerald-500'
				}
			]}
			icon="🤑"
			class="lg:col-start-3 row-span-3 lg:row-start-1 lg:row-end-4 xl:col-start-4 2xl:col-start-5"
		/>

		<Widget
			data={[
				{
					title: 'Antal spot datapunkter',
					value: spotDataCount.toString()
				},
				{
					title: 'Seneste spot datapunkt',
					value: spotDataLatestDate
				}
			]}
			icon="ℹ️"
		/>

		<Widget
			data={[
				{
					title: 'Antal forbrug datapunkter',
					value: usageMeterDataCount.toString()
				},
				{
					title: 'Seneste forbrug datapunkt',
					value: usageMeterDataLatestDate
				}
			]}
			icon="ℹ️"
		/>
	</section>
	<Heading tag="h6">Grafer</Heading>
	<section class="grid gap-4 lg:grid-cols-2">
		<MonthAverageChartCard
			data={hours.map((_, index) => {
				const relevantData = usagePriceHourAndCalcualtions.filter(
					({ hour }) => DateTime.fromISO(hour).setZone('Europe/Copenhagen').hour === index
				);
				return {
					price: relevantData.reduce((a, { price }) => a + (price ?? 0), 0) / relevantData.length,
					hour: DateTime.fromObject({ hour: index }),
					usage: relevantData.reduce((a, { usage }) => a + usage, 0) / relevantData.length
				};
			})}
		/>

		<FullMonthUsageCard
			data={[...Array(DateTime.fromObject({ month }).daysInMonth).keys()].map((key) => {
				const relevantData = usagePriceHourAndCalcualtions.filter(
					({ hour }) => DateTime.fromISO(hour).setZone('Europe/Copenhagen').day === key + 1
				);
				return {
					price: relevantData.reduce((a, { price }) => a + (price ?? 0), 0) / relevantData.length,
					usage: relevantData.reduce((a, { usage }) => a + usage, 0),
					hour: DateTime.fromObject({ month, day: key + 1 })
				};
			})}
		/>
	</section>

	<DailyUsageChartCard
		data={usagePriceHourAndCalcualtions.map(({ usage, hour, price }) => ({
			hour: DateTime.fromISO(hour).setZone('Europe/Copenhagen'),
			usage,
			price
		}))}
	/>
</div>
