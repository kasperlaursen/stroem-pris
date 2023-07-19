<script lang="ts">
	import { cva } from 'class-variance-authority';
	import { classFromProps } from '$lib/utils/classFromProps';
	
	const customClasses: string = classFromProps($$restProps);
	const pieSlice = cva([]);

	export let chartSize = 400;
	export let startAngle: number;
	export let decimalValue: number; 
	export let title: string; 

	$: chartRadius = chartSize/2;
	$: fillAngle = Math.ceil(360 * decimalValue)
	$: endAngle = startAngle + fillAngle;


    $: x1 = 200 + 180 * Math.cos(Math.PI * startAngle / 180);
    $: y1 = 200 + 180 * Math.sin(Math.PI * startAngle / 180);

    $: x2 = 200 + 180 * Math.cos(Math.PI * endAngle / 180);
    $: y2 = 200 + 180 * Math.sin(Math.PI * endAngle / 180);

	$: isMoreThanHalf = decimalValue > 1/2;
</script>

<path data-label={title} d={`M${chartRadius},${chartRadius}  L${x1},${y1} A180,180 0 ${isMoreThanHalf ? 1 : 0}, 1 ${x2},${y2} z`} class={pieSlice({class: customClasses})}></path>
