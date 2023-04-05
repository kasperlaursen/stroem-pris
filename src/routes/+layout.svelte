<script lang="ts">
	import { page } from '$app/stores';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	// Needed for theming to work...
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import { theme } from '$lib/stores/theme';

	import '../app.css';
	import Header from '$lib/ui/Header/Header.svelte';

	import type { LayoutData } from './$types';

	export let data: LayoutData;

	$: ({ supabase, session } = data);

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<svelte:head>
	<title>Strømpris</title>
</svelte:head>

<main class="h-full grid grid-rows-[1fr_auto] sm:grid-rows-[auto_1fr]">
	<Header isOnline={Boolean($page.data.session)} class="row-start-2 sm:row-start-1 z-10" />
	<div class="grid container mx-auto overflow-hidden">
		<slot />
	</div>
</main>
