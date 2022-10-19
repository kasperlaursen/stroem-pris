<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';
	import type { ActionData } from '.svelte-kit/types/src/routes/$types';

	export let form: ActionData;
</script>

<h1>Invitation accepted!</h1>
<p>Please set a password for your account below!</p>

{#if form && form?.error}
	<div>
		<p>Password set failed...</p>
		<p>{form.error}</p>
	</div>
{/if}

<form method="POST" action="?/setPassword">
	<Input name="password" type="password" placeholder="Password" />
	<Button>Set Password</Button>
</form>
