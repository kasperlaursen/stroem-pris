<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';
	import type { ActionData } from '.svelte-kit/types/src/routes/$types';

	export let form: ActionData;
</script>

<h1>Password Reset</h1>
<p>Please set a new password for your account below!</p>

{#if form && form?.error}
	<div>
		<p>Update failed...</p>
		<p>{form.error}</p>
	</div>
{/if}

<form method="POST" action="?/setPassword">
	<Input name="password" type="password" placeholder="New Password" />
	<Button>Update Password</Button>
</form>
