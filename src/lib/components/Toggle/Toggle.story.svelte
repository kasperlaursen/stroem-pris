<script lang="ts">
	import Toggle from './Toggle.svelte';
	import type { Hst as HstType } from '@histoire/plugin-svelte';
	export let Hst: HstType;

	let id = 'toggle';
	let disabled = false;
	let isChecked = false;
</script>

<Hst.Story>
	<Toggle {id} {disabled} checked={isChecked} />
	<svelte:fragment slot="controls">
		<Hst.Text title="Id" bind:value={id} />
		<Hst.Checkbox title="Disabled" bind:value={disabled} />
		<Hst.Checkbox title="Checked" bind:value={isChecked} />
	</svelte:fragment>
</Hst.Story>
