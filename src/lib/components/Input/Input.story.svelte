<script lang="ts">
	import Input from './Input.svelte';
	import type { InputTypes } from './types';
	import type { Hst as HstType } from '@histoire/plugin-svelte';
	export let Hst: HstType;

	let type: InputTypes = 'text';
	const typeOptions: { label: InputTypes; value: InputTypes }[] = [
		{ label: 'text', value: 'text' },
		{ label: 'number', value: 'number' },
		{ label: 'date', value: 'date' }
	];
</script>

<Hst.Story>
	<Input {type} />
	<svelte:fragment slot="controls">
		<Hst.Select options={typeOptions} bind:value={type} title="type" />
	</svelte:fragment>
</Hst.Story>
