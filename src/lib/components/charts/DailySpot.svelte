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

	export let spotData: { priceArea: PriceAreas; priceDKK: number; hourUTC: DateTime }[] = [];
	const sortedData = spotData
		.sort((a, b) =>
			a.hourUTC.setZone('Europe/Copenhagen').hour > b.hourUTC.setZone('Europe/Copenhagen').hour
				? 1
				: -1
		)
		.reverse();

	const isToday: boolean =
		sortedData[0].hourUTC.setZone('Europe/Copenhagen').day === DateTime.now().day;
	const dataColors = isToday
		? sortedData.map(({ hourUTC }) =>
				hourUTC.setZone('Europe/Copenhagen').hour < DateTime.now().hour
					? 'rgba(148, 163, 184, 0.5)'
					: 'rgba(148, 163, 184, 1)'
		  )
		: 'rgba(148, 163, 184, 1)';

	Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels);

	const data: ChartData<'bar'> = {
		labels: sortedData.map(({ hourUTC }) => {
			const hour = hourUTC.setZone('Europe/Copenhagen').hour;
			return `kl: ${`0${hour}`.slice(-2)} - ${`0${hour + 1}`.slice(-2)}`;
		}),
		datasets: [
			{
				label: 'kr/kwh DKK',
				data: sortedData.map(({ priceDKK }) => Number((priceDKK / 1000).toFixed(2))),
				backgroundColor: dataColors
			}
		]
	};
</script>

<Bar
	{data}
	options={{
		responsive: true,
		indexAxis: 'y',
		plugins: {
			datalabels: {
				anchor: 'end',
				align: 'end',
				formatter: (value) => {
					return `${value} kr`;
				}
			}
		}
	}}
/>
