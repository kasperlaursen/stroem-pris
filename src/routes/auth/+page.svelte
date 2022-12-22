<script lang="ts">
	import type { ActionData } from './$types';
	import Login from './components/login.svelte';
	export let form: ActionData;
</script>

{#if form?.success === false}
	<p>{form.error.message}</p>
{/if}

<form method="POST" action="?/signin" class="grid gap-4">
	<label for="email">E-mail:</label>
	<input id="email" name="email" type="email" placeholder="E-mail" />
	<label for="password">Kodeord:</label>
	<input id="password" name="password" type="password" placeholder="Kodeord" />
	<button type="submit">Log in</button>
</form>
