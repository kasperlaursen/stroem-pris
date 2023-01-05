<script lang="ts">
	import Option from './Option.svelte';
	import type { Hst } from '@histoire/plugin-svelte';
	export let Hst: Hst;
</script>

<Hst.Story>
	<Option value="value">Label</Option>
</Hst.Story>
