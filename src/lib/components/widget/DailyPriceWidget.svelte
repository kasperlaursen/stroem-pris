<script lang="ts">
	import Widget from './Widget.svelte';
	const customClasses = $$restProps.class;
	import { Input, P } from 'flowbite-svelte';
	import { DateTime } from 'luxon';

	export let data: {
		price: number | null;
		usage: number | null;
		hour: DateTime;
		hourTotal: number;
	}[];

	let lastDateDate = Math.max(...data.map(({ hour }) => hour.toMillis()));
	let firstDateDate = Math.min(...data.map(({ hour }) => hour.toMillis()));
	$: date = DateTime.fromMillis(lastDateDate).toISODate();

	$: dayData = data.filter(({ hour }) => hour.toISODate() === date);
</script>

<Widget
	data={[
		{
			title: 'Dagens Forbrug',
			value: dayData.reduce((acc, { usage }) => acc + (usage ?? 0), 0).toFixed(2),
			unit: 'kwh'
		},
		{
			title: 'Dagens Total Pris',
			value: dayData.reduce((acc, { hourTotal }) => acc + (hourTotal ?? 0), 0).toFixed(2),
			unit: 'kr'
		}
	]}
	icon="🕵️"
	class={`${customClasses} flex flex-col-reverse row-span-3`}
	{...$$restProps}
>
	<div class="grid gap-2">
		<P weight="medium" class="opacity-60">Vælg dato</P>
		<Input
			id="fixed"
			placeholder="Din fastpris"
			bind:value={date}
			type="date"
			min={DateTime.fromMillis(firstDateDate).toISODate()}
			max={DateTime.fromMillis(lastDateDate).toISODate()}
		/>
	</div>
</Widget>
