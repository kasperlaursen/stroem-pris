<script lang="ts">
	import SpotChart from './SpotChart.svelte';
	import type { Hst as HstType } from '@histoire/plugin-svelte';
	import type { SpotChartData } from './types';
	import { DateTime } from 'luxon';
	export let Hst: HstType;

	let data: SpotChartData = {
		average: 2,
		max: 3,
		entries: [
			{ price: 1.24, time: DateTime.fromObject({ hour: 23 }) },
			{ price: 1.44, time: DateTime.fromObject({ hour: 22 }) },
			{ price: 2.0, time: DateTime.fromObject({ hour: 21 }) },
			{ price: 2.3, time: DateTime.fromObject({ hour: 20 }) },
			{ price: 2.93, time: DateTime.fromObject({ hour: 19 }) },
			{ price: 2.5, time: DateTime.fromObject({ hour: 18 }) },
			{ price: 2.17, time: DateTime.fromObject({ hour: 17 }) },
			{ price: 2.1, time: DateTime.fromObject({ hour: 16 }) },
			{ price: 1.96, time: DateTime.fromObject({ hour: 15 }) },
			{ price: 1.74, time: DateTime.fromObject({ hour: 14 }) },
			{ price: 1.75, time: DateTime.fromObject({ hour: 13 }) },
			{ price: 1.41, time: DateTime.fromObject({ hour: 12 }) },
			{ price: 1.3, time: DateTime.fromObject({ hour: 11 }) },
			{ price: 1.5, time: DateTime.fromObject({ hour: 10 }) },
			{ price: 1.69, time: DateTime.fromObject({ hour: 9 }) },
			{ price: 2.0, time: DateTime.fromObject({ hour: 8 }) },
			{ price: 1.8, time: DateTime.fromObject({ hour: 7 }) },
			{ price: 1.49, time: DateTime.fromObject({ hour: 6 }) },
			{ price: 1.34, time: DateTime.fromObject({ hour: 5 }) },
			{ price: 1.04, time: DateTime.fromObject({ hour: 4 }) },
			{ price: 1.09, time: DateTime.fromObject({ hour: 3 }) },
			{ price: 1.14, time: DateTime.fromObject({ hour: 2 }) },
			{ price: 1.35, time: DateTime.fromObject({ hour: 1 }) },
			{ price: 1.42, time: DateTime.fromObject({ hour: 0 }) }
		]
	};
</script>

<Hst.Story title="SpotChart" group="SpotChart">
	<SpotChart {data} />
	<svelte:fragment slot="controls">
		<Hst.Json value={data} title="Data" />
	</svelte:fragment>
</Hst.Story>
