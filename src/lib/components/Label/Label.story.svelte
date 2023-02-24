<script lang="ts">
	import Label from './Label.svelte';
	import type { Hst as HstType } from '@histoire/plugin-svelte';
	export let Hst: HstType;
</script>

<Hst.Story>
	<Label>Label text</Label>
</Hst.Story>
