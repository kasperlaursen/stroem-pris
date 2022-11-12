<script lang="ts">
	import Widget from './Widget.svelte';
	import Input from '../base/Input.svelte';
	const customClasses = $$restProps.class;
	export let totalUsage: number = 0;
	export let totalSpot: number = 0;
	$: fixed = 5.3;
</script>

<Widget
	data={[
		{
			title: 'Total pris (fast)',
			value: (totalUsage * fixed).toFixed(2),
			unit: 'kr'
		},
		{
			title: 'Total pris (spot)',
			value: totalSpot.toFixed(2),
			unit: 'kr'
		},
		{
			title: 'Forskel',
			value: (totalUsage * fixed - totalSpot).toFixed(2),
			unit: 'kr',
			valueColor: totalUsage * fixed > totalSpot ? 'text-red-500' : 'text-green-500'
		}
	]}
	icon="🤑"
	class={customClasses}
	{...$$restProps}
>
	<p class="opacity-60 font-semibold text-sm">Fast pris beregner</p>
	<label for="fixed">Din fastpris (kr/kwh)</label>
	<input
		class="dark:bg-neutral-800 dark:border-neutral-700 rounded"
		id="fixed"
		placeholder="Din fastpris"
		bind:value={fixed}
		type="number"
	/>
</Widget>
