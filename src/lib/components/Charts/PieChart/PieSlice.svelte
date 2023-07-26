<script lang="ts">
  import { cva } from "class-variance-authority";
  import { classFromProps } from "$lib/utils/classFromProps";

  const customClasses: string = classFromProps($$restProps);
  const pieSlice = cva(["stroke-white","dark:stroke-neutral-800"]);

  export let chartSize = 400;
  export let startAngle: number;
  export let decimalValue: number;
  export let sliceLabel: string = "";
  export let title: string = "";
  
  $: sliceOffset = chartSize / 2 * 0.9;
  $: labelOffset = sliceOffset * 0.6;

  $: id = title.replaceAll(" ", "_");

  $: chartRadius = chartSize / 2;
  $: fillAngle = Math.ceil(360 * decimalValue);
  $: endAngle = startAngle + fillAngle;
  $: middleAngle = startAngle + fillAngle / 2;

  $: isMoreThanHalf = decimalValue > 1 / 2;

  $: x1 = chartRadius + sliceOffset * Math.cos((Math.PI * startAngle) / 180);
  $: y1 = chartRadius + sliceOffset * Math.sin((Math.PI * startAngle) / 180);

  $: x2 = chartRadius + sliceOffset * Math.cos((Math.PI * endAngle) / 180);
  $: y2 = chartRadius + sliceOffset * Math.sin((Math.PI * endAngle) / 180);

  $: xCenter = chartRadius + labelOffset * Math.cos((Math.PI * middleAngle) / 180);
  $: yCenter = chartRadius + labelOffset * Math.sin((Math.PI * middleAngle) / 180);
</script>

<g {id}>
  <path
    stroke-width={chartSize/100}
    data-label={title}
    d={`M${chartRadius},${chartRadius}  L${x1},${y1} A${sliceOffset},${sliceOffset} 0 ${
      isMoreThanHalf ? 1 : 0
    }, 1 ${x2},${y2} z`}
    class={pieSlice({ class: customClasses })}
  />
  {#if fillAngle > 18}
    <text
      x={xCenter}
      y={yCenter}
      dy=".3em"
      text-anchor="middle"
      startOffset="50%"
      class="text-sm"
    >
      <tspan text-anchor="middle" class="fill-slate-50 font-bold"
        >{title + " "}{(decimalValue * 100).toFixed(0)}%</tspan
      >
      <tspan
        text-anchor="middle"
        class="fill-slate-50 opacity-80 font-normal"
        x={xCenter}
        y={yCenter + 25}>{sliceLabel}</tspan
      >
    </text>
  {/if}
</g>
