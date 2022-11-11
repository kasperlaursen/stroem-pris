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
	import Button from '../base/Button.svelte';

	export let spotData: PageData['spotData'] = [];
	export let usageMeterData: PageData['usageMeterData'] = [];

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

		const datasets: [ChartData<'line'>['datasets'][number], ChartData<'bar'>['datasets'][number]] =
			[
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

<h2 class="flex justify-between">
	Dagens forbrug pr. time
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
		<input
			class="border-0 rounded bg-neutral-200 dark:bg-neutral-800 cursor-pointer"
			type="date"
			name="date"
			bind:value={date}
			max={lastDate.toISODate()}
			min={firstDate.toISODate()}
		/>
	</span>
</h2>

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
