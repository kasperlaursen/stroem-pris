<script lang="ts">
	import { page } from '$app/stores';
	import Card from '$lib/components/base/Card.svelte';
	import Link from '$lib/components/base/Link.svelte';
	import DailySpot from '$lib/components/charts/DailySpot.svelte';
	import type { PageData } from '.svelte-kit/types/src/routes/$types';

	export let data: PageData;
</script>

<Card>
	<div class="flex justify-between">
		<h1 class="font-medium uppercase">Spot Prices</h1>
		<span>
			<Link color={data.priceArea === 'DK1' ? 'PRIMARY' : 'SECONDARY'} href="?area=DK1">DK1</Link>
			<Link color={data.priceArea === 'DK2' ? 'PRIMARY' : 'SECONDARY'} href="?area=DK2">DK2</Link>
		</span>
	</div>
	<DailySpot spotData={data.spotToday} feeData={data.feesToday} />
</Card>
