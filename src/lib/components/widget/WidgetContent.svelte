<script lang="ts">
	export let title: string;
	export let value: string;
	export let unit: string | undefined = undefined;
	const customClasses = $$restProps.class;
	export let valueColor: string = '';
</script>

<div {...$$restProps} class={customClasses}>
	<p class="opacity-60 font-semibold text-sm">{title}</p>
	<p class={`text-xl font-bold ${valueColor}`}>
		{value}
		{#if unit}
			<small class={`opacity-60 font-semibold text-xs`}>{unit}</small>
		{/if}
	</p>
</div>
