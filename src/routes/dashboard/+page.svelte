<script lang="ts">
	import Widget from '$lib/components/widget/Widget.svelte';
	import MonthAverageCompare from '$lib/components/charts/MonthAverageCompare.svelte';
	import type { PageData } from '.svelte-kit/types/src/routes/dashboard/$types';
	import { DateTime } from 'luxon';
	import MonthUsageChart from '$lib/components/charts/MonthUsageChart.svelte';
	import DayUsageChart from '$lib/components/charts/DayUsageChart.svelte';
	import FixedPriceWidget from '$lib/components/widget/FixedPriceWidget.svelte';
	import { Heading, Select, Card, Alert } from 'flowbite-svelte';

	export let data: PageData;
	const { errors, month, priceArea, session, spotData, usageMeterData } = data;

	$: spotAverage = (
		spotData?.reduce((acc, { priceDKK }) => acc + priceDKK, 0) / spotData?.length
	).toFixed(2);

	$: totalUsage = usageMeterData.reduce((acc, { measurement }) => acc + measurement, 0);

	$: usageSpotAverage = () => {
		const hourlyUsageDKK = usageMeterData
			.map(({ hourUTC: meterHourUTC, measurement }) => {
				const priceAtHour = spotData.find(
					({ hourUTC: spotHourUTC }) => spotHourUTC.toMillis() === meterHourUTC.toMillis()
				)?.priceDKK;
				return priceAtHour ? priceAtHour * measurement : null;
			})
			.filter((value) => Boolean(value)) as number[];
		return hourlyUsageDKK.reduce((acc, usageDKK) => acc + usageDKK, 0) / totalUsage;
	};

	$: spotDataCount = spotData.length;
	$: spotDataLatestDate = DateTime.fromMillis(
		Math.max(...spotData.map(({ hourUTC }) => hourUTC.toMillis()))
	).toLocaleString(DateTime.DATETIME_MED, { locale: 'da-DK' });

	$: usageMeterDataCount = usageMeterData.length;
	$: usageMeterDataLatestDate = DateTime.fromMillis(
		Math.max(...usageMeterData.map(({ hourUTC }) => hourUTC.toMillis()))
	).toLocaleString(DateTime.DATETIME_MED, { locale: 'da-DK' });

	$: lowestUsageMeterData =
		usageMeterData
			.map(({ measurement }) => measurement)
			.filter(Boolean)
			.sort((a, b) => a - b)
			.slice(0, usageMeterData.length / 24)
			.reduce((acc, measurement) => acc + measurement, 0) /
		(usageMeterData.length / 24);

	$: highestUsageMeterData =
		usageMeterData
			.map(({ measurement }) => measurement)
			.filter(Boolean)
			.sort((a, b) => a - b)
			.reverse()
			.slice(0, usageMeterData.length / 24)
			.reduce((acc, measurement) => acc + measurement, 0) /
		(usageMeterData.length / 24);

	$: totalUsageSpotPrice = () => {
		const hourlyUsageDKK = usageMeterData
			.map(({ hourUTC: meterHourUTC, measurement }) => {
				const priceAtHour = spotData.find(
					({ hourUTC: spotHourUTC }) => spotHourUTC.toMillis() === meterHourUTC.toMillis()
				)?.priceDKK;
				return priceAtHour ? priceAtHour * measurement : null;
			})
			.filter((value) => Boolean(value)) as number[];
		return hourlyUsageDKK.reduce((acc, usageDKK) => acc + usageDKK, 0);
	};

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
		<form method="get" action="?/" class="flex gap-4 grow ">
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
		</form>
	</section>
	<section class="grid gap-4 grid-cols-auto-fit-250 grid-rows-[90px] max-w-full">
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
				title: 'Gennemsnit kr/kwh (spot)',
				value: spotAverage,
				unit: 'kr/kwh'
			}}
			icon="📈"
		/>

		<Widget
			data={{
				title: 'Forbrug kr/kwh (spot)',
				value: usageSpotAverage().toFixed(2),
				unit: 'kr/kwh'
			}}
			icon="💸"
		/>

		<FixedPriceWidget totalSpot={totalUsageSpotPrice()} {totalUsage} />

		<Widget
			data={[
				{
					title: 'Antal spot datapunkter',
					value: spotDataCount.toString()
				},
				{
					title: 'Seneste spot datapunkt',
					value: spotDataLatestDate
				},
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

		<Widget
			data={{
				title: 'Laveste gennemsnit',
				value: lowestUsageMeterData.toFixed(2),
				unit: 'kwh'
			}}
			icon="💤"
		/>

		<Widget
			data={{
				title: 'Højeste gennemsnit',
				value: highestUsageMeterData.toFixed(2),
				unit: 'kwh'
			}}
			icon="😱"
		/>
		<Widget
			data={{
				title: 'Total pris (spot)',
				value: totalUsageSpotPrice().toFixed(2),
				unit: 'kr'
			}}
			icon="💰"
		/>
	</section>
	<section class="grid gap-4 lg:grid-cols-2">
		<Card class="min-w-full gap-4">
			<MonthAverageCompare {usageMeterData} {spotData} />
		</Card>
		<Card class="min-w-full gap-4">
			<MonthUsageChart {usageMeterData} {spotData} {month} />
		</Card>
	</section>

	<Card class="min-w-full gap-4">
		<DayUsageChart {usageMeterData} {spotData} />
	</Card>
</div>
