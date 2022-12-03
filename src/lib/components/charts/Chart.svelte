<script lang="ts">
	import type { ApexOptions } from 'apexcharts';
	import { onMount, afterUpdate, onDestroy } from 'svelte';

	export let options: ApexOptions;
	const customClasses = $$restProps.class;
	let chartContainer: HTMLDivElement;

	let chart: any;

	$: {
		options = {
			...options
		};
		onMount(async () => {
			const ApexCharts = (await import('apexcharts')).default;
			chart = new ApexCharts(chartContainer, options);
			chart.render();
		});
		onDestroy(() => {
			if (chart) {
				chart.updateOptions(options);
			}
		});
	}

	afterUpdate(() => {
		if (chart) {
			chart.updateOptions(options);
		}
	});
</script>

<div {...$$restProps} class={`${customClasses} max-w-full`} bind:this={chartContainer} />
