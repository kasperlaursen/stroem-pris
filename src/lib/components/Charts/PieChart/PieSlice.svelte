<script lang="ts">
	import { cva } from 'class-variance-authority';
	import { classFromProps } from '$lib/utils/classFromProps';

	const customClasses: string = classFromProps($$restProps);
	const pieSlice = cva([]);

	export let chartSize = 400;
	export let startAngle: number;
	export let decimalValue: number; 
	export let sliceLabel: string = ""; 
	export let title: string; 

	$: id = title.replaceAll(" ", "_");

	$: chartRadius = chartSize/2;
	$: fillAngle = Math.ceil(360 * decimalValue)
	$: endAngle = startAngle + fillAngle;
	$: middleAngle = startAngle + fillAngle/2;

	$: isMoreThanHalf = decimalValue > 1/2;

    $: x1 = chartRadius + 180 * Math.cos(Math.PI * startAngle / 180);
    $: y1 = chartRadius + 180 * Math.sin(Math.PI * startAngle / 180);

    $: x2 = chartRadius + 180 * Math.cos(Math.PI * endAngle / 180);
    $: y2 = chartRadius + 180 * Math.sin(Math.PI * endAngle / 180);

    $: xCenter = chartRadius + 110 * Math.cos(Math.PI * middleAngle / 180);
    $: yCenter = chartRadius + 110 * Math.sin(Math.PI * middleAngle / 180);

</script>

<g id={id}>
	<path 
		stroke="rgb(38 38 38)"
		stroke-width="5"
		data-label={title} d={`M${chartRadius},${chartRadius}  L${x1},${y1} A180,180 0 ${isMoreThanHalf ? 1 : 0}, 1 ${x2},${y2} z`} 
		class={pieSlice({class: customClasses})}
		/>
		{#if fillAngle > 18}
			<text x={xCenter} y={yCenter} dy=".3em" text-anchor="middle" startOffset="50%" class="text-sm">
				<tspan text-anchor="middle" class="fill-slate-50 font-bold">{title + " "}{(decimalValue*100).toFixed(0)}%</tspan>
				<tspan text-anchor="middle"  class="fill-slate-300 font-normal" x={xCenter} y={yCenter+25}>{sliceLabel}</tspan>
			</text>
		{/if}
</g>
