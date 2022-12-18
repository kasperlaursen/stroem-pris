<script lang="ts">
	import { DateTime } from 'luxon';
	import { onMount } from 'svelte';

	export let hour: DateTime;
	export let price: number;
	export let max: number;
	export let averageLast30Days: number | null;

	const width = ((price / max) * 100).toFixed(0);
	let now = DateTime.now();
	$: isNow = hour.day === now.day && hour.hour === now.hour;
	$: isPast = hour.day === now.day && hour.hour < now.hour;

	onMount(() => {
		setInterval(() => (now = DateTime.now()), 60 * 1000);
	});

	const red = 'bg-red-500 bg-opacity-90 dark:bg-red-600 dark:bg-opacity-70';
	const yellow = 'bg-amber-500 bg-opacity-90 dark:bg-amber-500 dark:bg-opacity-70';
	const green = 'bg-emerald-500 bg-opacity-90 dark:bg-emerald-500 dark:bg-opacity-70';

	const color = () => {
		if (!averageLast30Days) {
			return red;
		}

		const avg = averageLast30Days / 1000;

		if (price <= avg * 0.9) {
			return green;
		}

		if (price >= avg * 1.1) {
			return red;
		}

		return yellow;
	};
</script>

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
				class={`flex h-full ${color()} dark:bg-opacity-80 rounded-full transition-all w-0`}
				style={`width: ${width}%`}
			/>
		</div>
	</div>
</div>
