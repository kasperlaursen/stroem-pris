<script lang="ts">
	import Fieldset from './Fieldset.svelte';
	import Label from '../Label/Label.svelte';
	import Input from '../Input/Input.svelte';
	import type { Hst as HstType } from '@histoire/plugin-svelte';
	export let Hst: HstType;
</script>

<Hst.Story>
	<Fieldset>
		<Label>Label text</Label>
		<Input type="text" placeholder="Text field" />
	</Fieldset>
</Hst.Story>
