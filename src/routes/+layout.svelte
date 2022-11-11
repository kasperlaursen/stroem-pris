<script lang="ts">
	import '../app.css';
	import { supabaseClient } from '$lib/supabaseClient';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { navigating } from '$app/stores';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Bolt } from '@steeze-ui/heroicons';

	onMount(() => {
		const {
			data: { subscription }
		} = supabaseClient.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<Header />
<div class="mx-auto my-4 container min-h-[calc(100vh-72px)]">
	{#if Boolean($navigating)}
		<div class="h-full w-full grid place-items-center">
			<span class="grid place-items-center">
				<Icon src={Bolt} theme="solid" class="animate-spin h-8 w-8" />
				Loading data...
			</span>
		</div>
	{:else}
		<slot />
	{/if}
</div>
<Footer />
