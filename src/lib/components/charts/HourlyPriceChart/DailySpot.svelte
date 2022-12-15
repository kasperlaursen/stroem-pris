<script lang="ts">
	import type { FeeKeys } from '$lib/types/fees';
	import type { PriceAreas } from '$lib/energidataservice/types';
	import type { DateTime } from 'luxon';
	import Row from './Row.svelte';

	export let spotData: { priceArea: PriceAreas; priceDKK: number; hourUTC: DateTime }[] = [];
	export let feeData: { [fee in FeeKeys]: number };

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

	const max = Math.max(...sortedData.map(({ priceDKK }) => priceDKK)) * 1.2;
</script>

<div class="text-xs md:text-sm">
	{#each sortedData as hour}
		<Row hour={hour.hourUTC} price={hour.priceDKK} {max} />
	{/each}
</div>
