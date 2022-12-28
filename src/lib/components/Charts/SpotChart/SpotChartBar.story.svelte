<script lang="ts">
	import SpotChartBar from './SpotChartBar.svelte';
	import type { Hst } from '@histoire/plugin-svelte';
	import type { Colors } from './types';
	export let Hst: Hst;

	let width: number = 0.5;
	let color: Colors = 'neutral';
</script>

<Hst.Story title="SpotChartBar" group="SpotChart">
	<SpotChartBar {width} {color} />
	<svelte:fragment slot="controls">
		<Hst.Number bind:value={width} title="Width" />
		<Hst.Select
			options={[
				{ label: 'neutral', value: 'neutral' },
				{ label: 'red', value: 'red' },
				{ label: 'green', value: 'green' },
				{ label: 'yellow', value: 'yellow' }
			]}
			bind:value={color}
			title="Color"
		/>
	</svelte:fragment>
</Hst.Story>
