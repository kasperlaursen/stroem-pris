<script lang="ts">
	import type { FeeKeys } from '$lib/types/fees';
	import type { PriceAreas } from '$lib/energidataservice/types';
	import type { DateTime } from 'luxon';
	import Row from './Row.svelte';

	export let spotData: { priceArea: PriceAreas; priceDKK: number; hourUTC: DateTime }[] = [];
	export let feeData: { [fee in FeeKeys]: number };
	export let averageLast30Days: number | null;

	const sortedData = spotData
		.sort((a, b) => a.hourUTC.toMillis() - b.hourUTC.toMillis())
		.reverse()
		.map(({ hourUTC, priceArea, priceDKK }) => ({
			hourUTC: hourUTC.setZone('Europe/Copenhagen'),
			priceArea,
			priceDKK:
				(priceDKK / 1000 +
					(feeData.elafgift + feeData.transmissionstarif + feeData.systemtarif) / 100) *
				1.25
		}));

	const relativeDateFormatter = new Intl.RelativeTimeFormat('da-DK', {
		numeric: 'auto',
		style: 'narrow'
	});

	const max = Math.max(...sortedData.map(({ priceDKK }) => priceDKK)) * 1.1;
</script>

<div class="text-xs md:text-sm select-none w-full">
	<div class="uppercase px-4 pt-4 dark:text-white text-black font-medium">
		{relativeDateFormatter.format(Math.ceil(sortedData[20].hourUTC.diffNow('days').days), 'day')}
	</div>
	{#each sortedData as hour}
		<Row hour={hour.hourUTC} price={hour.priceDKK} {max} {averageLast30Days} />
	{/each}
</div>
