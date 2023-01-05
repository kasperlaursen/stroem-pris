<script lang="ts">
	import Logo from './Logo.svelte';
	import type { Hst } from '@histoire/plugin-svelte';
	import type { LogoVariant } from './types';
	export let Hst: Hst;

	let variant: LogoVariant = 'full';
</script>

<Hst.Story group="ui">
	<Logo {variant} />
	<svelte:fragment slot="controls">
		<Hst.Select
			options={[
				{ label: 'full', value: 'full' },
				{ label: 'condensed', value: 'condensed' }
			]}
			bind:value={variant}
			title="Variant"
		/>
	</svelte:fragment>
</Hst.Story>
