<script lang="ts">
	import SpotChartValue from './SpotChartValue.svelte';
	import type { Hst as HstType } from '@histoire/plugin-svelte';
	export let Hst: HstType;

	let content = '2.45 kr';
</script>

<Hst.Story title="SpotChartValue" group="SpotChart">
	<SpotChartValue>{content}</SpotChartValue>
	<svelte:fragment slot="controls">
		<Hst.Text bind:value={content} title="content" />
	</svelte:fragment>
</Hst.Story>
