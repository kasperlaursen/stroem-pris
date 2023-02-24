<script lang="ts">
	import SpotChartRow from './SpotChartRow.svelte';
	import SpotChartLabel from './SpotChartLabel.svelte';
	import SpotChartValue from './SpotChartValue.svelte';
	import SpotChartBar from './SpotChartBar.svelte';
	import type { RowState } from './types';
	import type { Hst as HstType } from '@histoire/plugin-svelte';
	export let Hst: HstType;

	let content = 'Add components here';
	let state: RowState = 'none';
</script>

<Hst.Story title="SpotChartRow" group="SpotChart">
	<SpotChartRow {state}>
		<SpotChartLabel>kl. 23</SpotChartLabel>
		<SpotChartValue>1,05 kr</SpotChartValue>
		<SpotChartBar width={0.5} color="green" />
	</SpotChartRow>
	<svelte:fragment slot="controls">
		<Hst.Text bind:value={content} title="Content" />
		<Hst.Select
			options={[
				{ label: 'none', value: 'none' },
				{ label: 'active', value: 'active' },
				{ label: 'inactive', value: 'inactive' }
			]}
			bind:value={state}
			title="State"
		/>
	</svelte:fragment>
</Hst.Story>
