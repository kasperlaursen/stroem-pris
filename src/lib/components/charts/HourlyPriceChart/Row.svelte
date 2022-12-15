<script lang="ts">
	import { DateTime } from 'luxon';

	export let hour: DateTime;
	export let price: number;
	export let max: number;

	const width = ((price / max) * 100).toFixed(0);
	const now = DateTime.now();
	const isNow = hour.day === now.day && hour.hour === now.hour;
	const isPast = hour.day === now.day && hour.hour < now.hour;

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
	class={`grid grid-cols-[max-content,auto] gap-1 px-4 ${
		isNow && 'bg-slate-300 bg-opacity-20 py-2'
	} ${isPast && 'opacity-50'}`}
>
	<div class="font-mono flex gap-4">
		<div>{hour.toFormat('kl. HH')}</div>
		<div class="dark:text-white text-black font-medium">{price.toFixed(2)}kr</div>
	</div>

	<div class={`w-full p-1 ${isNow && 'animate-pulse font-bold'}`}>
		<div class="w-full h-full rounded-full bg-slate-500 dark:bg-opacity-30 bg-opacity-10">
			<div
				class="h-full bg-red-500 dark:bg-red-600 dark:bg-opacity-80 rounded-full"
				style={`width: ${width}%`}
			/>
		</div>
	</div>
</div>
