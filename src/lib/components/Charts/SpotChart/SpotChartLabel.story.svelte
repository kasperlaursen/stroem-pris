<script lang="ts">
	import SpotChartLabel from './SpotChartLabel.svelte';
	import type { Hst as HstType } from '@histoire/plugin-svelte';
	export let Hst: HstType;

	let content = 'kl. 23';
</script>

<Hst.Story title="SpotChartLabel" group="SpotChart">
	<SpotChartLabel>{content}</SpotChartLabel>
	<svelte:fragment slot="controls">
		<Hst.Text bind:value={content} title="content" />
	</svelte:fragment>
</Hst.Story>
