<script lang="ts">
	import Card from '../base/Card.svelte';
	import WidgetContent from './WidgetContent.svelte';
	export let data:
		| { title: string; value: string; unit?: string; valueColor?: string }
		| { title: string; value: string; unit?: string; valueColor?: string }[];
	export let icon: string = '';
	const customClasses = $$restProps.class;
</script>

{#if Array.isArray(data)}
	<Card
		{...$$restProps}
		class={`${customClasses} row-span-${data.length < 5 ? data.length : data.length - 1} gap-4`}
		{icon}
	>
		<slot />
		{#each data as entry}
			<WidgetContent {...entry} />
		{/each}
	</Card>
{:else}
	<Card {customClasses} {icon}>
		<slot />
		<WidgetContent {...data} />
	</Card>
{/if}
