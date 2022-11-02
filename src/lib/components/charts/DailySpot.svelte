<script lang="ts">
	import { Bar } from 'svelte-chartjs';
	import {
		Chart,
		Title,
		Tooltip,
		Legend,
		BarElement,
		CategoryScale,
		LinearScale,
		type ChartData
	} from 'chart.js';
	import ChartDataLabels from 'chartjs-plugin-datalabels';
	import type { PriceAreas } from '$lib/energidataservice/types';
	import { DateTime } from 'luxon';
	import { theme } from '$lib/stores';
	import type { FeeKeys } from '$lib/types/fees';

	export let spotData: { priceArea: PriceAreas; priceDKK: number; hourUTC: DateTime }[] = [];
	export let feeData: { [fee in FeeKeys]: number };

	const sortedData = spotData
		.sort((a, b) =>
			a.hourUTC.setZone('Europe/Copenhagen').hour > b.hourUTC.setZone('Europe/Copenhagen').hour
				? 1
				: -1
		)
		.reverse();

	const isToday: boolean =
		sortedData[0].hourUTC.setZone('Europe/Copenhagen').day === DateTime.now().day;

	const getDataColors = (r: number, g: number, b: number) =>
		isToday
			? sortedData.map(({ hourUTC }) =>
					hourUTC.setZone('Europe/Copenhagen').hour < DateTime.now().hour
						? `rgb(${r}, ${g}, ${b}, 0.5)`
						: `rgba(${r}, ${g}, ${b}, 1)`
			  )
			: `rgba(${r}, ${g}, ${b}, 1)`;

	Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels);

	const elafgifter = sortedData.map(() => feeData.elafgift / 100);
	const transmissiionstariffer = sortedData.map(() => feeData.transmissionstarif / 100);
	const systemtariffer = sortedData.map(() => feeData.systemtarif / 100);
	const spot = sortedData.map(({ priceDKK }) => Number((priceDKK / 1000).toFixed(2)));
	const moms = sortedData.map(
		(value, index) =>
			(elafgifter[index] + transmissiionstariffer[index] + systemtariffer[index] + spot[index]) *
			0.25
	);

	const datasets = [
		{
			label: 'ElAfgift kr/kwh DKK',
			data: elafgifter,
			backgroundColor: getDataColors(52, 211, 153)
		},
		{
			label: 'Transmissionstarif kr/kwh DKK',
			data: transmissiionstariffer,
			backgroundColor: getDataColors(34, 211, 238)
		},
		{
			label: 'Systemtarif kr/kwh DKK',
			data: systemtariffer,
			backgroundColor: getDataColors(129, 140, 248)
		},
		{
			label: 'Moms kr/kwh DKK',
			data: moms,
			backgroundColor: getDataColors(251, 191, 36)
		},
		{
			label: 'Spot kr/kwh DKK',
			data: spot,
			backgroundColor: getDataColors(148, 163, 184)
		}
	];

	const getTotalByIndex = (index: number) =>
		datasets.reduce((previous, current) => current.data[index] + previous, 0);

	const data: ChartData<'bar'> = {
		labels: sortedData.map(({ hourUTC }) => {
			const hour = hourUTC.setZone('Europe/Copenhagen').hour;
			return `kl: ${`0${hour}`.slice(-2)} - ${`0${hour + 1}`.slice(-2)}`;
		}),
		datasets: datasets
	};
</script>

<div class="overflow-hidden">
	<Bar
		class="chart"
		{data}
		style="max-width: 100%; height: 700px"
		options={{
			scales: {
				x: {
					stacked: true
				},
				y: {
					stacked: true
				}
			},
			animation: false,
			color: $theme === 'light' ? '#000' : '#fff',
			responsive: true,
			maintainAspectRatio: false,
			indexAxis: 'y',
			plugins: {
				datalabels: {
					anchor: 'end',
					align: 'end',
					formatter: (value, context) => {
						if (context.dataset.label?.includes('Spot')) {
							return `${getTotalByIndex(context.dataIndex).toFixed(2)} kr`;
						} else {
							return '';
						}
					}
				}
			}
		}}
	/>
</div>

<style>
	.chart {
		height: 500px;
		width: 500px;
	}
</style>
