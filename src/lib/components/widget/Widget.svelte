<script lang="ts">
	import { Card } from 'flowbite-svelte';
	import WidgetContent from './WidgetContent.svelte';
	export let data:
		| { title: string; value: string; unit?: string; valueColor?: string }
		| { title: string; value: string; unit?: string; valueColor?: string }[];
	export let icon: string = '';
	const customClasses = $$restProps.class;
</script>

{#if Array.isArray(data)}
	<Card
		padding="sm"
		size="lg"
		{...$$restProps}
		class={`${customClasses} row-span-${
			data.length < 5 ? data.length : data.length - 1
		} gap-4 !p-4 !relative`}
	>
		<div class={`absolute top-2 right-4`}>{icon}</div>
		<slot />
		{#each data as entry}
			<WidgetContent {...entry} />
		{/each}
	</Card>
{:else}
	<Card padding="sm" size="lg" horizontal {customClasses} class="!p-4  !relative">
		<div class={`absolute top-2 right-4`}>{icon}</div>
		<slot />
		<WidgetContent {...data} />
	</Card>
{/if}
