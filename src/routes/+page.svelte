<script lang="ts">
	import SpotChart from '$lib/components/Charts/SpotChart/SpotChart.svelte';
	import Card from '$lib/components/Card/Card.svelte';
	import type { SpotChartData } from '$lib/components/Charts/SpotChart/types';
	import { spotDataToSpotChartEntries } from '$lib/utils/spotDataToSpotChartEntries';
	import ErrorList from '$lib/ui/ErrorList/ErrorList.svelte';
	import PriceAreaForm from './PriceAreaForm.svelte';
	import { type UserSettings, userSettings } from '$lib/stores/userSettingsStore';

	const CHART_MAX_MULTIPLIER = 1.1;

	export let data;
	let { data: pageData, errors, area } = data;
	let { spotData, feesData } = pageData;

	let spotChartData: SpotChartData | null = null;

	if (spotData && feesData) {
		const chartEntries = spotDataToSpotChartEntries({
			spotData,
			feesData,
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

	const priceInfoMessage = ({ includeFees, includeTariff, includeVat }: UserSettings): string => {
		const includedList = [
			includeFees ? `Elafgift` : null,
			includeTariff ? `Gebyrer` : null,
			includeVat ? `Moms` : null
		];
		const includedString = includedList.filter(Boolean).join(', ');
		return includedString
			? `Viser Spot pris inkluisv: ${includedString}`
			: 'Viser Spot pris eksklusiv gebyrer, elafgift og moms';
	};
</script>

<div class="max-h-full overflow-hidden grid grid-rows-[auto_auto_1fr]">
	<ErrorList {errors} />
	<div class="flex justify-between items-center p-2">
		<h1 class="font-medium text-gray-800 dark:text-gray-200">Variabel Strømpris</h1>
		<PriceAreaForm {area} />
	</div>
	<div class="overflow-hidden">
		<Card spacing="base" class="overflow-y-auto mb-2 max-h-full">
			{#if spotChartData}
				<SpotChart data={spotChartData} autoScroll />
			{/if}
			<small class="px-2">{priceInfoMessage($userSettings)}</small>
		</Card>
	</div>
</div>
