<script lang="ts">
	import Alert from './Alert.svelte';
	import type { Hst } from '@histoire/plugin-svelte';
	export let Hst: Hst;
</script>

<Hst.Story>
	<div class="grid gap-4">
		<Alert title="Danger Variant" variant="danger">
			Lorem ipsum dolor sit amet consectetur adipisicing elit. <br />
			Nesciunt assumenda quia ad cupiditate culpa recusandae provident aperiam aliquam vero! Dolorem.
		</Alert>
		<Alert title="Warning Variant" variant="warning">
			Lorem ipsum dolor sit amet consectetur adipisicing elit. <br />
			Nesciunt assumenda quia ad cupiditate culpa recusandae provident aperiam aliquam vero! Dolorem.
		</Alert>
		<Alert title="Info Variant" variant="info">
			Lorem ipsum dolor sit amet consectetur adipisicing elit. <br />
			Nesciunt assumenda quia ad cupiditate culpa recusandae provident aperiam aliquam vero! Dolorem.
		</Alert>
		<Alert title="Neutral Variant" variant="neutral">
			Lorem ipsum dolor sit amet consectetur adipisicing elit. <br />
			Nesciunt assumenda quia ad cupiditate culpa recusandae provident aperiam aliquam vero! Dolorem.
		</Alert>
	</div>
</Hst.Story>
