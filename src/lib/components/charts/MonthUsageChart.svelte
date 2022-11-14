<script lang="ts">
	import { Chart } from 'svelte-chartjs';
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		BarElement,
		CategoryScale,
		LinearScale,
		LogarithmicScale,
		type ChartData,
		type ChartDataset,
		PointElement,
		LineElement,
		LineController,
		BarController
	} from 'chart.js';
	import { DateTime } from 'luxon';
	import { theme } from '$lib/stores';
	import type { PageData } from '.svelte-kit/types/src/routes/dashboard/$types';
	import { onDestroy } from 'svelte';
	import { Heading } from 'flowbite-svelte';

	export let spotData: PageData['spotData'] = [];
	export let month: PageData['month'];
	export let usageMeterData: PageData['usageMeterData'] = [];

	let data: any;

	const days = [...Array(DateTime.fromObject({ month }).daysInMonth).keys()].map((key) => key + 1);

	$: {
		const spotDayAverage = days.map((key, index) => {
			const relevantEntries = spotData.filter(
				({ hourUTC }) => hourUTC.setZone('Europe/Copenhagen').day === key
			);
			return relevantEntries.reduce((a, { priceDKK }) => a + priceDKK, 0) / relevantEntries.length;
		});

		const usageMeterDayTotal = days.map((key, index) => {
			const relevantEntries = usageMeterData.filter(
				({ hourUTC }) => hourUTC.setZone('Europe/Copenhagen').day === key
			);
			return relevantEntries.reduce((a, { measurement }) => a + measurement, 0);
		});

		const datasets: [ChartData<'line'>['datasets'][number], ChartData<'bar'>['datasets'][number]] =
			[
				{
					label: 'Forbrug (kwh)',
					type: 'line',
					cubicInterpolationMode: 'monotone',
					yAxisID: 'A',
					data: usageMeterDayTotal,
					backgroundColor: 'rgba(244, 63, 94)',
					borderColor: 'rgba(244, 63, 94)'
				},
				{
					label: 'Spot Gennemsnit (kr/kwh)',
					type: 'bar',
					yAxisID: 'B',
					data: spotDayAverage,
					backgroundColor: 'rgba(148, 163, 184, 0.7)'
				}
			];

		data = {
			labels: days.map((key) => {
				const day = DateTime.fromObject({ day: key, month });
				return day.toFormat('dd / MM');
			}),
			datasets: datasets
		};
	}

	ChartJS.register(
		Title,
		Tooltip,
		Legend,
		LogarithmicScale,
		BarElement,
		BarController,
		LineController,
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement
	);
</script>

<Heading customSize="text-lg font-semibold">Månedens forbrug pr. dag</Heading>
<div class="overflow-hidden">
	<Chart
		type="bar"
		{data}
		style="max-width: 100%; height: 700px"
		options={{
			interaction: {
				mode: 'index',
				intersect: false
			},
			animation: false,
			color: $theme === 'light' ? '#000' : '#fff',
			responsive: true,
			maintainAspectRatio: false,
			indexAxis: 'x',
			plugins: {},
			scales: {
				A: {
					type: 'linear',
					display: true,
					position: 'left'
				},
				B: {
					type: 'logarithmic',
					display: true,
					position: 'right',
					grid: {
						drawOnChartArea: false
					}
				}
			}
		}}
	/>
</div>
