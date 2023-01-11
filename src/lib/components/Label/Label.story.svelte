<script lang="ts">
	import Label from './Label.svelte';
	import type { Hst } from '@histoire/plugin-svelte';
	export let Hst: Hst;
</script>

<Hst.Story>
	<Label>Label text</Label>
</Hst.Story>
