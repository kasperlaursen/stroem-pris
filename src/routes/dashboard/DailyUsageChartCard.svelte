<script lang="ts">
	import PriceUsageChart from '$lib/components/charts/PriceUsageChart.svelte';
	import { Input, Card, Heading } from 'flowbite-svelte';
	import { DateTime } from 'luxon';

	export let data: { price: number | null; usage: number | null; hour: DateTime }[];

	const avgPrice =
		data.reduce((accumulator, { price }) => (price ?? 0) + accumulator, 0) / data.length;

	const avgUsage =
		data.reduce((accumulator, { usage }) => (usage ?? 0) + accumulator, 0) / data.length;

	let firstDate =
		data.sort((a, b) => a.hour.toMillis() - b.hour.toMillis()).at(1)?.hour ??
		DateTime.now().set({ day: 1 });

	let lastDate =
		data.sort((a, b) => a.hour.toMillis() - b.hour.toMillis()).at(-1)?.hour ??
		DateTime.now().toUTC().minus({ days: 1 });

	let date: string = lastDate.toISODate();

	const maxPrice = Math.max(...data.map(({ price }) => price ?? 0)) + 0.5;
	const maxUsage = Math.max(...data.map(({ usage }) => usage ?? 0)) + 0.5;
</script>

<Card class="min-w-full gap-4" padding="none">
	<div class="flex justify-between p-8 pb-0">
		<Heading customSize="text-lg font-semibold">Forbrug samt pris pr. time</Heading>
		<span class="flex gap-4 items-center">
			<span
				class={`${
					DateTime.fromISO(date).toMillis() > firstDate.toMillis()
						? 'cursor-pointer'
						: 'cursor-not-allowed pointer-events-none opacity-40'
				} select-none`}
				on:keyup
				on:click={() => {
					date = DateTime.fromISO(date).minus({ days: 1 }).toISODate();
				}}>⬅️</span
			>
			<span
				class={`${
					DateTime.fromISO(date).toMillis() <= lastDate.minus({ days: 1 }).toMillis()
						? 'cursor-pointer'
						: 'cursor-not-allowed pointer-events-none opacity-40'
				} select-none`}
				on:keyup
				on:click={() => {
					date = DateTime.fromISO(date).plus({ days: 1 }).toISODate();
				}}>➡️</span
			>
			<Input
				class="!text-base !leading-4"
				size="sm"
				type="date"
				name="date"
				bind:value={date}
				max={lastDate.toISODate()}
				min={firstDate.toISODate()}
			/>
		</span>
	</div>
	<PriceUsageChart
		{avgPrice}
		{avgUsage}
		{maxPrice}
		{maxUsage}
		data={data
			.filter(({ hour }) => date === hour.toISODate())
			.map(({ hour, price, usage }) => ({
				price,
				usage,
				label: `${hour.toFormat('HH:mm')} - ${hour.plus({ hours: 1 }).toFormat('HH:mm')}`
			}))}
	/>
</Card>
