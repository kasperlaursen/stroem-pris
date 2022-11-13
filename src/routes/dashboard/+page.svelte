<script lang="ts">
	import Alert from '$lib/components/base/Alert.svelte';
	import Widget from '$lib/components/widget/Widget.svelte';
	import MonthAverageCompare from '$lib/components/charts/MonthAverageCompare.svelte';
	import type { PageData } from '.svelte-kit/types/src/routes/dashboard/$types';
	import { DateTime } from 'luxon';
	import Card from '$lib/components/base/Card.svelte';
	import MonthUsageChart from '$lib/components/charts/MonthUsageChart.svelte';
	import DayUsageChart from '$lib/components/charts/DayUsageChart.svelte';
	import FixedPriceWidget from '$lib/components/widget/FixedPriceWidget.svelte';

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
	let monthNumber = Number(month);
</script>

<div class="grid gap-4">
	{#each errors as error}
		<Alert>{error.message}</Alert>
	{/each}
	<section class="flex justify-between">
		<h2 class="text-2xl font-medium capitalize">
			🗓️ {DateTime.fromObject({ month: month }).toFormat('MMMM y', {
				locale: 'da-DK'
			})}
		</h2>
		<form method="get" action="?/" class="flex justify-between">
			<select
				name="month"
				bind:value={monthNumber}
				on:change={handleChange}
				class="border-0 rounded bg-neutral-200 dark:bg-neutral-800 cursor-pointer capitalize"
			>
				{#each months as name, index}
					<option value={index + 1}>{name}</option>
				{/each}
			</select>
		</form>
	</section>
	<section class="grid gap-4 grid-cols-auto-fit-250 max-w-full">
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
		<Card>
			<MonthAverageCompare {usageMeterData} {spotData} />
		</Card>
		<Card>
			<MonthUsageChart {usageMeterData} {spotData} {month} />
		</Card>
	</section>

	<Card>
		<DayUsageChart {usageMeterData} {spotData} />
	</Card>
</div>
