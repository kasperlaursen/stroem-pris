<script lang="ts">
	import Button from './Button.svelte';
	import type { Hst } from '@histoire/plugin-svelte';
	export let Hst: Hst;
</script>

<Hst.Story>
	<Button>Button text</Button>
</Hst.Story>
