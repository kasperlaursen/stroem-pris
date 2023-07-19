<script lang="ts">
	import { cva } from 'class-variance-authority';
	import { classFromProps } from '$lib/utils/classFromProps';
	import PieSlice from './PieSlice.svelte';
	import type { PiceSliceProps, PieChartData } from './types';

	const customClasses: string = classFromProps($$restProps);
	const pieChart = cva(["w-full"]);
	const chartSize = 400;

	export let data: PieChartData[];

	$: total = data.reduce((acc, slice) => acc + slice.value, 0);
	$: currentAngle = 0;

	const getSliceProps = (data: PieChartData[]):PiceSliceProps[] => {
		const sliceProps: PiceSliceProps[] = [];
		data.forEach((slice) => {
			const decimalValue = slice.value / total;
			sliceProps.push({
				chartSize,
				decimalValue,
				startAngle: currentAngle,
				class: slice.color,
				title: slice.label
			})
			const fillAngle = Math.ceil(360 * decimalValue)
			currentAngle += fillAngle;
		})
		return sliceProps;
	}
</script>

<svg viewBox={`0 0 ${chartSize} ${chartSize}`} class={pieChart({class: customClasses})}>
	{#each getSliceProps(data) as slice }
		<PieSlice {...slice}  />
	{/each}
</svg>
