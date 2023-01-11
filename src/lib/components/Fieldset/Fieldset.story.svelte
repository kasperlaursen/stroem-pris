<script lang="ts">
	import Fieldset from './Fieldset.svelte';
	import type { Hst } from '@histoire/plugin-svelte';
	import Label from '../Label/Label.svelte';
	import Input from '../Input/Input.svelte';
	export let Hst: Hst;
</script>

<Hst.Story>
	<Fieldset>
		<Label>Label text</Label>
		<Input type="text" placeholder="Text field" />
	</Fieldset>
</Hst.Story>
