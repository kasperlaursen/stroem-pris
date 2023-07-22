<script lang="ts">
	import { cva } from 'class-variance-authority';
	import { classFromProps } from '$lib/utils/classFromProps';
	import type { PieChartData } from './types';

	const customClasses: string = classFromProps($$restProps);
	const pieChartLabelContainer = cva(["flex","flex-wrap", "gap-x-4", "gap-y-2", "justify-center"]);
	const pieChartLabelColor = cva(["h-4", "w-4", "rounded-full"]);
	const pieChartLabel= cva(["grid", "gap-3", "items-center", "grid-cols-[0.8rem,_auto]"]);

	export let data: PieChartData[];


</script>

<div class={pieChartLabelContainer({class: customClasses})}>
{#each data as entry }
    <div class={pieChartLabel()}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="50" class={pieChartLabelColor({class: entry.color})}  />
          </svg> 
        <span>{entry.label}</span>
    </div>
{/each}
</div>


