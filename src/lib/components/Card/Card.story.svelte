<script lang="ts">
	import Card from './Card.svelte';
	import type { Hst } from '@histoire/plugin-svelte';
	export let Hst: Hst;
</script>

<Hst.Story>
	<Card>Card Content</Card>
</Hst.Story>
