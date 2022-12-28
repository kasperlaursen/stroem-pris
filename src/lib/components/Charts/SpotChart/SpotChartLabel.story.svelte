<script lang="ts">
	import SpotChartLabel from './SpotChartLabel.svelte';
	import type { Hst } from '@histoire/plugin-svelte';
	export let Hst: Hst;

	let content: string = 'kl. 23';
</script>

<Hst.Story title="SpotChartLabel" group="SpotChart">
	<SpotChartLabel>{content}</SpotChartLabel>
	<svelte:fragment slot="controls">
		<Hst.Text bind:value={content} title="content" />
	</svelte:fragment>
</Hst.Story>
