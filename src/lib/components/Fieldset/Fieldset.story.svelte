<script lang="ts">
	import Fieldset from './Fieldset.svelte';
	import Label from '../Label/Label.svelte';
	import Input from '../Input/Input.svelte';
	import type { Hst as HstType } from '@histoire/plugin-svelte';
	import type { Direction } from './types';
	export let Hst: HstType;

	let direction: Direction = 'stacked';
</script>

<Hst.Story>
	<Fieldset {direction}>
		<Label>Label text</Label>
		<Input type="text" placeholder="Text field" />
	</Fieldset>
	<svelte:fragment slot="controls">
		<Hst.Select
			options={[
				{ label: 'stacked', value: 'stacked' },
				{ label: 'inline', value: 'inline' }
			]}
			bind:value={direction}
			title="Spacing"
		/>
	</svelte:fragment>
</Hst.Story>
