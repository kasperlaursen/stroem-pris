<script lang="ts">
	import type { ApexOptions } from 'apexcharts';
	import { theme } from '$lib/stores';
	import Chart from './Chart.svelte';

	export let data: { price: number | null; usage: number | null; label: string }[];
	export let avgPrice: number | undefined = undefined;
	export let avgUsage: number | undefined = undefined;

	let options: ApexOptions;
	$: {
		let series: ApexOptions['series'] = [
			{
				name: 'Pris',
				type: 'column',
				color: '#64748b',
				data: data.map(({ price }) => price && Number(price?.toFixed(2)))
			},
			{
				name: 'Forbrug',
				type: 'line',
				color: '#ef4444',
				data: data.map(({ usage }) => usage && Number(usage?.toFixed(2)))
			}
		];

		options = {
			series,
			theme: {
				mode: $theme
			},
			tooltip: {
				intersect: false
			},
			chart: {
				height: 500,
				type: 'line',
				background: 'transparent',
				toolbar: {
					tools: {
						download: true,
						pan: false,
						reset: false,
						zoom: false,
						selection: false,
						zoomin: false,
						zoomout: false
					}
				}
			},
			fill: {
				type: 'solid',
				opacity: 1
			},
			labels: data?.map(({ label }) => label),
			stroke: {
				width: [0, 4],

				curve: 'smooth'
			},
			dataLabels: {
				enabled: false,
				enabledOnSeries: [0, 1]
			},
			annotations: {
				yaxis: []
			},
			yaxis: [
				{
					title: {
						text: 'Pris'
					},
					labels: {
						formatter: (price) => (price !== null ? `${price.toFixed(2)} kr` : 'ukendt')
					}
				},
				{
					opposite: true,
					title: {
						text: 'Forbrug'
					},
					labels: {
						formatter: (usage) => (usage !== null ? `${usage.toFixed(2)} kwh` : 'ukendt')
					}
				}
			]
		};

		if (avgPrice) {
			options.annotations?.yaxis?.push({
				y: avgPrice,
				borderColor: '#0284c7',
				borderWidth: 2,
				strokeDashArray: 0,
				label: {
					borderColor: 'rgb(50, 50, 50)',
					style: {
						color: '#fff',
						background: '#0284c7'
					},
					text: 'Mnd. gns. Pris'
				}
			});
		}

		if (avgUsage) {
			options.annotations?.yaxis?.push({
				y: avgUsage,
				borderColor: '#ea580c',
				borderWidth: 2,
				strokeDashArray: 0,
				label: {
					borderColor: 'rgb(50, 50, 50)',
					style: {
						color: '#fff',
						background: '#ea580c'
					},
					text: `Mnd. gns. Forbrug`
				}
			});
		}
	}
</script>

<Chart {options} class="h-[400px]" />
