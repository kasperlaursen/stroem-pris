<script lang="ts">
	import { page } from '$app/stores';
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<h1 class="text-3xl font-bold underline">Hello world!</h1>

{#if $page.data.session}
	<form method="POST" action="/auth?/signout" class="grid gap-4">
		<button type="submit">Log ud</button>
	</form>
{:else}
	<a href="/auth">Log ind</a>
{/if}
