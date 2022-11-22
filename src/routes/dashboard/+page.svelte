<script lang="ts">
	import Widget from '$lib/components/widget/Widget.svelte';
	import MonthAverageCompare from '$lib/components/charts/MonthAverageCompare.svelte';
	import type { PageData } from '.svelte-kit/types/src/routes/dashboard/$types';
	import { DateTime } from 'luxon';
	import MonthUsageChart from '$lib/components/charts/MonthUsageChart.svelte';
	import DayUsageChart from '$lib/components/charts/DayUsageChart.svelte';
	import FixedPriceWidget from '$lib/components/widget/FixedPriceWidget.svelte';
	import { Heading, Select, Card, Alert, Button, Drawer, Toggle } from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';

	let drawerHidden = true;
	let transitionParams = {
		x: 320,
		duration: 200,
		easing: sineIn
	};

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

	let moms = typeof localStorage !== 'undefined' ? localStorage.settingMoms === 'true' : false;
	let elafgift =
		typeof localStorage !== 'undefined' ? localStorage.settingElafgift === 'true' : false;
	let tariffer =
		typeof localStorage !== 'undefined' ? localStorage.settingTariffer === 'true' : false;

	const handleSettingsChange = () => {
		if (typeof localStorage !== 'undefined') {
			localStorage.settingMoms = moms;
			localStorage.settingElafgift = elafgift;
			localStorage.settingTariffer = tariffer;
		}
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
		<form class="grid gap-4" on:change={handleSettingsChange}>
			<Heading tag="h6">Moms & Afgifter</Heading>
			<Toggle name="moms" bind:checked={moms}>Vis data inklusiv Moms</Toggle>
			<Toggle name="elafgift" bind:checked={elafgift}>Vis data inklusiv ElAfgift</Toggle>
			<Toggle name="tariffer" bind:checked={tariffer}>Vis data inklusiv Tariffer</Toggle>
			<Heading tag="h6" class="mt-4">Transport</Heading>
		</form>
	</Drawer>
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
				title: 'Total spot pris',
				value: totalUsageSpotPrice().toFixed(2),
				unit: 'kr'
			}}
			icon="💰"
		/>

		<Widget
			data={{
				title: 'Dit spot gennemsnit kr/kwh',
				value: usageSpotAverage().toFixed(2),
				unit: 'kr/kwh'
			}}
			icon="💸"
		/>

		<Widget
			data={{
				title: 'Gennemsnit spot kr/kwh',
				value: spotAverage,
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

		<FixedPriceWidget
			totalSpot={totalUsageSpotPrice()}
			{totalUsage}
			class="lg:col-start-3 row-span-4 lg:row-start-1 lg:row-end-5 xl:col-start-4 2xl:col-start-5"
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
