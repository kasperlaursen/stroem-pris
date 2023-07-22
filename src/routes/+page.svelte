<script lang="ts">
	import SpotChart from '$lib/components/Charts/SpotChart/SpotChart.svelte';
	import Card from '$lib/components/Card/Card.svelte';
	import type { SpotChartData } from '$lib/components/Charts/SpotChart/types';
	import { spotDataToSpotChartEntries } from '$lib/utils/spotDataToSpotChartEntries';
	import ErrorList from '$lib/ui/ErrorList/ErrorList.svelte';
	import PriceAreaForm from './PriceAreaForm.svelte';
	import { type UserSettings, userSettings } from '$lib/stores/userSettingsStore';
	import { selectedHour } from '$lib/stores/selectedHourStore';
	import { browser } from '$app/environment';
	import HourPriceInfo from './HourPriceInfo.svelte';
	import SettingsCard from '$lib/ui/SettingsCard.svelte';

	const CHART_MAX_MULTIPLIER = 1.1;

	export let data;
	let { data: pageData, errors, area, netcompanyParam } = data;
	let { spotData, feesData, netTarifData } = pageData;

	let spotChartData: SpotChartData | null = null;

	$:{
		if (spotData && feesData) {
			const chartEntries = spotDataToSpotChartEntries({
				spotData,
				feesData,
				netTarifData,
				settings: $userSettings
			});

			const entiresPrice = chartEntries.map((entry) => entry.price);
			const entiresAverage = entiresPrice.reduce((sum, num) => sum + num, 0) / entiresPrice.length;
			const chartMax = Math.max(...entiresPrice);

			spotChartData = {	
				average: entiresAverage,
				max: chartMax * CHART_MAX_MULTIPLIER,
				entries: chartEntries
			};
		}
	}

	const priceInfoMessage = ({
		includeTax,
		includeFees,
		includeTariff,
		includeVat,
		netCompany
	}: UserSettings): string => {
		const includedList = [
			includeTax ? `Elafgift` : null,
			includeTariff ? `Tariffer (${netCompany})` : null,
			includeFees ? `Gebyrer` : null,
			includeVat ? `Moms` : null
		];
		const includedString = includedList.filter(Boolean).join(', ');
		return includedString
			? `Viser Spot pris inkluisv: ${includedString}`
			: 'Viser Spot pris eksklusiv Gebyrer, Tariffer, Elafgift og Moms';
	};

	if ($userSettings.netCompany && !netcompanyParam && browser) {
		const url = new URL(window.location.href);
		url.searchParams.set('netcompany', $userSettings.netCompany);
		window.location.href = url.href;
	}

	$: showPieChart = Object.values($userSettings).some(value => value === true);

</script>

<div class="max-h-full overflow-hidden grid grid-rows-[auto_auto_1fr]">
	<ErrorList {errors} />
	<div class="flex justify-between items-center p-2">
		<h1 class="font-medium text-gray-800 dark:text-gray-200">Variabel Strømpris</h1>
		<PriceAreaForm {area} />
	</div>
	<div class={`overflow-hidden gap-4 grid lg:grid-rows-1 ${showPieChart ? "lg:grid-cols-[1fr,400px]" : ""}`}>
		<Card class="overflow-y-auto mb-2 max-h-full h-max">
			{#if spotChartData}
				<SpotChart data={spotChartData} autoScroll />
			{/if}
			<small class="px-2"
				>{priceInfoMessage($userSettings)} -
				<a
					class="text-primary-500 underline hover:text-primary-400"
					target="_blank"
					href="/settings"
				>
					Tilpas her
				</a>
			</small>
		</Card>
		<div class="hidden lg:grid max-h-full overflow-y-auto gap-4 h-min">
			{#if showPieChart }
				<Card class="hidden lg:block h-max">
					<HourPriceInfo spotData={spotData ?? []} feesData={feesData ?? []} netTarifData={netTarifData ?? []} hour={$selectedHour.selectedHour} />
				</Card>
			{/if}
			<!-- <SettingsCard class="hidden lg:block h-max gap-4" /> -->
		</div>
	</div>
</div>
