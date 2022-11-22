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
	import ChartDataLabels from 'chartjs-plugin-datalabels';
	import { DateTime } from 'luxon';
	import { theme } from '$lib/stores';
	import type { PageData } from '.svelte-kit/types/src/routes/dashboard/$types';
	import { Heading, Input } from 'flowbite-svelte';
	import type { FeeKeys } from '$lib/types/fees';

	export let spotData: PageData['spotData'] = [];
	export let usageMeterData: PageData['usageMeterData'] = [];
	export let feeData: { [fee in FeeKeys]: number };
	export let visible: { moms: boolean; elafgift: boolean; tariffer: boolean };

	let firstDate =
		usageMeterData.sort((a, b) => a.hourUTC.toMillis() - b.hourUTC.toMillis()).at(1)?.hourUTC ??
		DateTime.now().set({ day: 1 });

	let lastDate =
		usageMeterData.sort((a, b) => a.hourUTC.toMillis() - b.hourUTC.toMillis()).at(-1)?.hourUTC ??
		DateTime.now().toUTC().minus({ days: 1 });

	let date: string = lastDate.toISODate();

	let data: any;

	const hours = [...Array(24).keys()] as const;

	$: {
		const spotHourAverage = hours.map(
			(_, index) =>
				spotData
					.filter(
						({ hourUTC }) =>
							hourUTC.setZone('Europe/Copenhagen').day ===
							DateTime.fromISO(date).setZone('Europe/Copenhagen').day
					)
					.find(({ hourUTC }) => hourUTC.setZone('Europe/Copenhagen').hour === index)?.priceDKK ?? 0
		);

		const elafgifter = hours.map(() => feeData.elafgift / 100);
		const transmissiionstariffer = hours.map(() => feeData.transmissionstarif / 100);
		const systemtariffer = hours.map(() => feeData.systemtarif / 100);
		const moms = hours.map(
			(index) =>
				(elafgifter[index] +
					transmissiionstariffer[index] +
					systemtariffer[index] +
					spotHourAverage[index]) *
				0.25
		);

		const usageMeterHourAverage = hours.map(
			(_, index) =>
				usageMeterData
					.filter(
						({ hourUTC }) =>
							hourUTC.setZone('Europe/Copenhagen').day ===
							DateTime.fromISO(date).setZone('Europe/Copenhagen').day
					)
					.find(({ hourUTC }) => hourUTC.setZone('Europe/Copenhagen').hour === index)
					?.measurement ?? 0
		);

		const datasets: [
			ChartData<'line'>['datasets'][number],
			ChartData<'bar'>['datasets'][number],
			ChartData<'bar'>['datasets'][number],
			ChartData<'bar'>['datasets'][number],
			ChartData<'bar'>['datasets'][number],
			ChartData<'bar'>['datasets'][number]
		] = [
			{
				label: 'Forbrug',
				type: 'line',
				cubicInterpolationMode: 'monotone',
				yAxisID: 'A',
				data: usageMeterHourAverage,

				backgroundColor: 'rgba(244, 63, 94)',
				borderColor: 'rgba(244, 63, 94)'
			},
			{
				label: 'ElAfgift',
				type: 'bar',
				yAxisID: 'B',
				data: elafgifter,
				backgroundColor: 'rgb(52, 211, 153)',
				hidden: !visible.elafgift
			},
			{
				label: 'Transmissionstarif',
				type: 'bar',
				yAxisID: 'B',
				data: transmissiionstariffer,
				backgroundColor: 'rgb(34, 211, 238)',
				hidden: !visible.tariffer
			},
			{
				label: 'Systemtarif',
				type: 'bar',
				yAxisID: 'B',
				data: systemtariffer,
				backgroundColor: 'rgb(129, 140, 248)',
				hidden: !visible.tariffer
			},
			{
				label: 'Moms',
				type: 'bar',
				yAxisID: 'B',
				data: moms,
				backgroundColor: 'rgb(251, 191, 36)',
				hidden: !visible.moms
			},
			{
				label: 'Spot',
				type: 'bar',
				yAxisID: 'B',
				data: spotHourAverage,
				backgroundColor: 'rgba(148, 163, 184, 0.7)'
			}
		];

		data = {
			labels: hours.map((_, index) => {
				const hour = DateTime.fromObject({ hour: index });
				return `${hour.toFormat('HH:mm')} - ${hour.plus({ hours: 1 }).toFormat('HH:mm')}`;
			}),
			datasets: datasets
		};
	}
	const getTotalByIndex = (index: number, datasets: ChartData<'bar'>['datasets'][number][]) =>
		datasets.reduce(
			(previous, { hidden, label, data }, reduceIndex) =>
				label !== 'Forbrug' || hidden ? (data[index] as number) + previous : previous,
			0
		);

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
		LineElement,
		ChartDataLabels
	);
</script>

<div class="flex justify-between">
	<Heading customSize="text-lg font-semibold">Dagens forbrug pr. time</Heading>
	<span class="flex gap-4 items-center">
		<span
			class={`${
				DateTime.fromISO(date).toMillis() > firstDate.toMillis()
					? 'cursor-pointer hover:animate-pulse'
					: 'cursor-not-allowed pointer-events-none opacity-40'
			} select-none`}
			on:keyup
			on:click={() => {
				date = DateTime.fromISO(date).minus({ days: 1 }).toISODate();
			}}>⬅️</span
		>
		<span
			class={`${
				DateTime.fromISO(date).toMillis() <= lastDate.toMillis()
					? 'cursor-pointer hover:animate-pulse'
					: 'cursor-not-allowed pointer-events-none opacity-40'
			} select-none`}
			on:keyup
			on:click={() => {
				date = DateTime.fromISO(date).plus({ days: 1 }).toISODate();
			}}>➡️</span
		>
		<Input
			class="!text-base !leading-4"
			size="sm"
			type="date"
			name="date"
			bind:value={date}
			max={lastDate.toISODate()}
			min={firstDate.toISODate()}
		/>
	</span>
</div>
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
				tooltip: {
					callbacks: {
						label: (context) => {
							if (context.dataset.label === 'Forbrug') {
								return `${context.parsed.y} kwh`;
							}
							return `${(context.parsed.y * 100).toFixed(1)} øre/kwh`;
						}
					}
				},
				datalabels: {
					anchor: 'end',
					align: 'end',
					rotation: -90,
					formatter: (value, context) => {
						if (context.dataset.label?.includes('Spot')) {
							return `${getTotalByIndex(context.dataIndex, data.datasets).toFixed(2)} kr`;
						} else {
							return '';
						}
					}
				}
			},
			scales: {
				x: {
					stacked: true
				},
				A: {
					type: 'linear',
					display: true,
					position: 'left'
				},
				B: {
					stacked: true,
					stack: 'all',
					type: 'linear',
					display: true,
					position: 'right',
					grid: {
						drawOnChartArea: false
					},
					max:
						Math.floor(
							Math.max(...hours.map((_, index) => getTotalByIndex(index, data.datasets)))
						) + 1
				}
			}
		}}
	/>
</div>
