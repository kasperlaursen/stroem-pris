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

	export let spotData: PageData['spotData'] = [];
	export let usageMeterData: PageData['usageMeterData'] = [];

	let data: any;

	const hours = [...Array(24).keys()] as const;

	$: {
		const spotHourAverage = hours.map((_, index) => {
			const relevantEntries = spotData.filter(
				({ hourUTC }) => hourUTC.setZone('Europe/Copenhagen').hour === index
			);
			return relevantEntries.reduce((a, { priceDKK }) => a + priceDKK, 0) / relevantEntries.length;
		});

		const usageMeterHourAverage = hours.map((_, index) => {
			const relevantEntries = usageMeterData.filter(
				({ hourUTC }) => hourUTC.setZone('Europe/Copenhagen').hour === index
			);
			return (
				relevantEntries.reduce((a, { measurement }) => a + measurement, 0) / relevantEntries.length
			);
		});

		const datasets: [ChartData<'line'>['datasets'][number], ChartData<'bar'>['datasets'][number]] =
			[
				{
					label: 'Forbrug',
					type: 'line',
					data: usageMeterHourAverage,
					backgroundColor: 'rgba(14, 116, 144)',
					borderColor: 'rgba(14, 116, 144)'
				},
				{
					label: 'Spot',
					type: 'bar',
					data: spotHourAverage,
					backgroundColor: 'rgba(148, 163, 184)'
				}
			];

		data = {
			labels: hours.map((_, index) => {
				const hour = DateTime.fromObject({ hour: index });
				return `${hour.toFormat('hh:mm')} - ${hour.plus({ hours: 1 }).toFormat('hh:mm')}`;
			}),
			datasets: datasets
		};
	}

	ChartJS.register(
		Title,
		Tooltip,
		Legend,
		BarElement,
		BarController,
		LineController,
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement
	);
</script>

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
			plugins: {
				title: {
					display: true,
					text: 'Månedligt gennemsnit pr. time'
				}
			},
			scales: {
				y: {
					type: 'linear',
					display: true,
					position: 'left'
				},
				y1: {
					type: 'linear',
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
