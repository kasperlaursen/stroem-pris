<script lang="ts">
	import { DateTime } from 'luxon';
	import { onMount } from 'svelte';

	export let hour: DateTime;
	export let price: number;
	export let max: number;

	const width = ((price / max) * 100).toFixed(0);
	let now = DateTime.now();
	const isNow = hour.day === now.day && hour.hour === now.hour;
	const isPast = hour.day === now.day && hour.hour < now.hour;

	onMount(() => {
		setInterval(() => (now = DateTime.now()), 5 * 60 * 60 * 1000);
	});

	const relativeDateFormatter = new Intl.RelativeTimeFormat('da-DK', {
		numeric: 'auto',
		style: 'narrow'
	});
</script>

{#if hour.hour === 23}
	<div class="uppercase px-4 pt-4 dark:text-white text-black font-medium">
		{relativeDateFormatter.format(Math.floor(hour.diffNow('days').days), 'day')}
	</div>
{/if}
<div
	class={`group grid grid-cols-[max-content,auto] gap-1 px-4 hover:bg-slate-300 hover:bg-opacity-10 transition ${
		isNow && 'bg-slate-300 bg-opacity-20 py-2 '
	} ${isPast && 'opacity-50'}`}
>
	<div class="font-mono flex gap-4">
		<div class={`${isNow && 'font-medium'}`}>{hour.toFormat('kl. HH')}</div>
		<div
			class={`dark:text-white text-black font-medium group-hover:font-extrabold group-hover:scale-110 ${
				isNow && 'font-bold'
			}`}
		>
			{price.toLocaleString('da-DK', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			})}kr
		</div>
	</div>

	<div class={`w-full p-1 ${isNow && 'animate-pulse font-bold'}`}>
		<div class="w-full h-full rounded-full bg-slate-500 dark:bg-opacity-30 bg-opacity-10">
			<div
				class="flex h-full bg-red-500 dark:bg-red-600 dark:bg-opacity-80 rounded-full transition-all w-0"
				style={`width: ${width}%`}
			/>
		</div>
	</div>
</div>
