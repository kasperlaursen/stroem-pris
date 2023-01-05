<script lang="ts">
	import Header from './Header.svelte';
	import type { Hst } from '@histoire/plugin-svelte';
	export let Hst: Hst;

	let isOnline: boolean = false;
</script>

<Hst.Story group="ui">
	<Header {isOnline} />
	<svelte:fragment slot="controls">
		<Hst.Checkbox bind:value={isOnline} title="isOnline" />
	</svelte:fragment>
</Hst.Story>
