<script lang="ts">
	import { P } from 'flowbite-svelte';

	export let title: string;
	export let value: string;
	export let unit: string | undefined = undefined;
	const customClasses = $$restProps.class;
	export let valueColor: string = '';
</script>

<div {...$$restProps} class={customClasses}>
	<P weight="medium" class="opacity-60">{title}</P>
	<P weight="bold" size="xl" class={valueColor}>
		{value}
		{#if unit}
			<small class={`opacity-60 font-semibold text-xs`}>{unit}</small>
		{/if}
	</P>
</div>
