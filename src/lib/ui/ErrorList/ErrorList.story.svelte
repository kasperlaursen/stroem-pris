<script lang="ts">
	import Header from './ErrorList.svelte';
	import type { Hst as HstType } from '@histoire/plugin-svelte';
	export let Hst: HstType;

	let isOnline = false;
</script>

<Hst.Story group="ui">
	<Header {isOnline} />
	<svelte:fragment slot="controls">
		<Hst.Checkbox bind:value={isOnline} title="isOnline" />
	</svelte:fragment>
</Hst.Story>
