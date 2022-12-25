<script lang="ts">
	import Card from './Card.svelte';
	import type { Hst } from '@histoire/plugin-svelte';
	export let Hst: Hst;

	let spacing: 'base' | 'none' = 'base';
</script>

<Hst.Story>
	<Card {spacing}>Card Content</Card>
	<svelte:fragment slot="controls">
		<Hst.Select
			options={[
				{ label: 'base', value: 'base' },
				{ label: 'none', value: 'none' }
			]}
			bind:value={spacing}
			title="Spacing"
		/>
	</svelte:fragment>
</Hst.Story>
