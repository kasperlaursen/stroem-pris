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
		<h1 class="font-medium text-lg">Spot pris for <b>idag</b></h1>
		<span>
			<Link color={data.priceArea === 'DK1' ? 'PRIMARY' : 'SECONDARY'} href="?area=DK1">DK1</Link>
			<Link color={data.priceArea === 'DK2' ? 'PRIMARY' : 'SECONDARY'} href="?area=DK2">DK2</Link>
		</span>
	</div>
	<p>
		Priserne i grafen er uden Nettarif (også kaldet Transport) da denne variere mellem netselskaber.
		<br />
		Du kan se hvilket netselskab du har på
		<Link href="https://www.danskenergi.dk/vejledning/nettilslutning/find-netselskab">
			Danskenergi.dk
		</Link>
	</p>
	<DailySpot spotData={data.spotToday} feeData={data.feesToday} />
</Card>
