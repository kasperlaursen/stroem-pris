<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/base/Button.svelte';
	import Link from '$lib/components/base/Link.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
</script>

<header
	class="flex gap-4 items-center w-full p-4  bg-transparent  dark:text-slate-50 text-slate-600 "
>
	<h1
		class="text-2xl uppercase font-extrabold md:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-500"
	>
		<a href="/">Strømpris</a>
	</h1>
	<span class="grow" />

	{#if !$page.data.session}
		<Link href="/login" color="PRIMARY">Login</Link>
	{:else}
		<Link color="GHOST" href="/profile">{$page.data.session.user.email}</Link>
		<form method="POST" action="/signout">
			<Button color="SECONDARY">Log out</Button>
		</form>
	{/if}
	<ThemeToggle />
</header>
