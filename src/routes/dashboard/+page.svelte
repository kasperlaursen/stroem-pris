<script lang="ts">
	import Widget from '$lib/components/widget/Widget.svelte';
	import type { PageData } from '.svelte-kit/types/src/routes/dashboard/$types';
	import { DateTime } from 'luxon';
	import {
		Heading,
		Select,
		Card,
		Alert,
		Button,
		Drawer,
		Toggle,
		Input,
		Label
	} from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import { getCurrentFeeByDateAndKey } from '$lib/utils/fees';
	import DailyUsageChartCard from './DailyUsageChartCard.svelte';
	import MonthAverageChartCard from './MonthAverageChartCard.svelte';
	import FullMonthUsageCard from './FullMonthUsageCard.svelte';

	let drawerHidden = true;
	let transitionParams = {
		x: 320,
		duration: 200,
		easing: sineIn
	};

	export let data: PageData;
	const { errors, month, priceArea, spotData, usageMeterData, feesData } = data;

	let moms = typeof localStorage !== 'undefined' ? localStorage.settingMoms !== 'false' : true;
	let elafgift =
		typeof localStorage !== 'undefined' ? localStorage.settingElafgift !== 'false' : true;
	let tariffer =
		typeof localStorage !== 'undefined' ? localStorage.settingTariffer !== 'false' : true;
	let compareFixedKwhPrice =
		typeof localStorage !== 'undefined' ? Number(localStorage.settingCompareFixedKwhPrice) : 0;
	let compareSpotFeeKwh =
		typeof localStorage !== 'undefined' ? Number(localStorage.settingCompareSpotFeeKwh) : 0;

	const hours = [...Array(24).keys()] as const;

	$: compareFixedKwhPriceKR = compareFixedKwhPrice ? compareFixedKwhPrice / 100 : 0;
	$: compareSpotFeeKwhKR = compareSpotFeeKwh ? compareSpotFeeKwh / 100 : 0;

	$: withVat = (value: number): number => value * (moms ? 1.25 : 1);

	$: feesAtTime = (hourUTC: DateTime): number => {
		let fees = 0;
		if (elafgift) {
			fees +=
				getCurrentFeeByDateAndKey(
					feesData,
					'elafgift',
					hourUTC.set({ hour: 0, minute: 0, second: 0 })
				) / 100;
		}

		if (tariffer) {
			fees +=
				getCurrentFeeByDateAndKey(
					feesData,
					'systemtarif',
					hourUTC.set({ hour: 0, minute: 0, second: 0 })
				) / 100;

			fees +=
				getCurrentFeeByDateAndKey(
					feesData,
					'transmissionstarif',
					hourUTC.set({ hour: 0, minute: 0, second: 0 })
				) / 100;
		}
		return fees;
	};

	$: spotAveragePrice = withVat(
		spotData?.reduce((acc, { priceDKK, hourUTC }) => acc + (priceDKK + feesAtTime(hourUTC)), 0) /
			spotData?.length
	);

	$: totalUsage = usageMeterData.reduce((acc, { measurement }) => acc + measurement, 0);

	$: usageSpotAveragePrice = () => {
		const hourlyUsageDKK = usageMeterData
			.map(({ hourUTC: meterHourUTC, measurement }) => {
				const priceAtHour = spotData.find(
					({ hourUTC: spotHourUTC }) => spotHourUTC.toMillis() === meterHourUTC.toMillis()
				)?.priceDKK;
				return priceAtHour ? (priceAtHour + feesAtTime(meterHourUTC)) * measurement : null;
			})
			.filter((value) => Boolean(value)) as number[];
		return withVat(hourlyUsageDKK.reduce((acc, usageDKK) => acc + usageDKK, 0) / totalUsage);
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
				return priceAtHour
					? (priceAtHour + feesAtTime(meterHourUTC) + (compareSpotFeeKwhKR || 0)) * measurement
					: null;
			})
			.filter((value) => Boolean(value)) as number[];
		return withVat(hourlyUsageDKK.reduce((acc, usageDKK) => acc + usageDKK, 0));
	};

	$: totalUsageFixedPrice = () => {
		const hourlyUsageDKK = usageMeterData
			.map(
				({ hourUTC: meterHourUTC, measurement }) =>
					(compareFixedKwhPriceKR + feesAtTime(meterHourUTC)) * measurement
			)
			.filter((value) => Boolean(value)) as number[];
		return withVat(hourlyUsageDKK.reduce((acc, usageDKK) => acc + usageDKK, 0));
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

	const handleSettingsChange = () => {
		console.log('handleSettingsChange', compareFixedKwhPrice);
		if (typeof localStorage !== 'undefined') {
			localStorage.settingMoms = moms;
			localStorage.settingElafgift = elafgift;
			localStorage.settingTariffer = tariffer;
			localStorage.settingCompareFixedKwhPrice = compareFixedKwhPrice;
			localStorage.settingCompareSpotFeeKwh = compareSpotFeeKwh;
		}
	};
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

			<Heading tag="h6" class="mt-4">Fast pris</Heading>
			<Label class="text-xs" for="fixed">Fastpris uden afgifter og moms (øre/kwh)</Label>
			<Input
				id="fixed"
				placeholder="Fastpris pr. kwh"
				bind:value={compareFixedKwhPrice}
				type="number"
			/>

			<Heading tag="h6" class="mt-4">Variabel med gebyr</Heading>
			<Label class="text-xs" for="fixed">Gebyr pr. kwh uden moms (øre/kwh)</Label>
			<Input id="fixed" placeholder="Gebyr pr. kwh" bind:value={compareSpotFeeKwh} type="number" />

			<Heading tag="h6" class="mt-4">Transport</Heading>
		</form>
	</Drawer>

	{#if moms || elafgift || tariffer}
		<Alert color="dark">{getMessage()}</Alert>
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
				title: 'Total spot pris',
				value: totalUsageSpotPrice().toFixed(2),
				unit: `kr `
			}}
			icon="💰"
		/>

		<Widget
			data={{
				title: 'Dit spot gennemsnit kr/kwh',
				value: usageSpotAveragePrice().toFixed(2),
				unit: 'kr/kwh'
			}}
			icon="💸"
		/>

		<Widget
			data={{
				title: 'Gennemsnit spot kr/kwh',
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
					title: 'Total pris (spot)',
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
				const relevantPrices = spotData.filter(
					({ hourUTC }) => hourUTC.setZone('Europe/Copenhagen').hour === index
				);
				const relevantUsage = usageMeterData.filter(
					({ hourUTC }) => hourUTC.setZone('Europe/Copenhagen').hour === index
				);
				return {
					price:
						relevantPrices.reduce(
							(a, { priceDKK, hourUTC }) => a + withVat(priceDKK + feesAtTime(hourUTC)),
							0
						) / relevantPrices.length,
					hour: DateTime.fromObject({ hour: index }),
					usage:
						relevantUsage.reduce((a, { measurement }) => a + measurement, 0) / relevantUsage.length
				};
			})}
		/>

		<FullMonthUsageCard
			data={[...Array(DateTime.fromObject({ month }).daysInMonth).keys()].map((key) => {
				const relevantPrices = spotData.filter(
					({ hourUTC }) => hourUTC.setZone('Europe/Copenhagen').day === key + 1
				);

				const relevantUsage = usageMeterData.filter(
					({ hourUTC }) => hourUTC.setZone('Europe/Copenhagen').day === key + 1
				);

				return {
					price:
						relevantPrices.reduce(
							(a, { priceDKK, hourUTC }) => a + withVat(priceDKK + feesAtTime(hourUTC)),
							0
						) / relevantPrices.length,
					usage: relevantUsage.reduce((a, { measurement }) => a + measurement, 0),
					hour: DateTime.fromObject({ month, day: key + 1 })
				};
			})}
		/>
	</section>

	<DailyUsageChartCard
		data={usageMeterData.map(({ measurement, hourUTC }) => {
			const spot = spotData.find(
				({ hourUTC: spotHourUTC }) => hourUTC.toMillis() === spotHourUTC.toMillis()
			)?.priceDKK;
			const price = spot ? withVat(spot + feesAtTime(hourUTC)) : null;
			return {
				price,
				hour: hourUTC.setZone('Europe/Copenhagen'),
				usage: measurement
			};
		})}
	/>
</div>
