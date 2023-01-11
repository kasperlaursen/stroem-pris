<script lang="ts">
	import { page } from '$app/stores';
	import { supabase } from '$lib/data/supabase/client';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import '../app.css';
	import Header from '$lib/ui/Header/Header.svelte';

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		const appHeight = () => {
			document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
		};
		window.addEventListener('resize', appHeight);
		appHeight();

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<svelte:head>
	<title>Strømpris</title>
</svelte:head>

<main class="h-full grid grid-rows-[1fr_auto] sm:grid-rows-[auto_1fr]">
	<Header isOnline={$page.data.session} class="row-start-2 sm:row-start-1 z-10" />
	<div class="container mx-auto overflow-y-auto">
		<slot />
	</div>
</main>
