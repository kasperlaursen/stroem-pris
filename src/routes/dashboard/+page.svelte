<script lang="ts">
	import Alert from '$lib/components/base/Alert.svelte';
	import Card from '$lib/components/base/Card.svelte';
	import type { PageData } from '.svelte-kit/types/src/routes/dashboard/$types';

	export let data: PageData;
</script>

<div class="grid gap-4">
	{#each data.errors as error}
		<Alert>{error.message}</Alert>
	{/each}
	<section class="grid gap-4 grid-cols-4">
		<Card class="gap-0">
			<h3 class="text-sm font-medium opacity-70">Strøm forbrug</h3>
			<h1 class="text-xl font-bold mt-0">
				{data.usageMeterData.reduce((acc, { measurement }) => acc + measurement, 0).toFixed(2)} kwh
			</h1>
		</Card>
	</section>
	<Card />
</div>
