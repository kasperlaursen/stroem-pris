<script lang="ts">
	import { page } from '$app/stores';
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';
	import type { ActionData } from '.svelte-kit/types/src/routes/$types';

	export let form: ActionData;
</script>

{#if !$page.data.session}
	<h1>You are not logged in</h1>

	{#if form && form?.error}
		<div>
			<p>Login failed...</p>
			<p>{form.error}</p>
		</div>
	{/if}

	<form method="POST" action="?/signin">
		<Input name="email" type="email" placeholder="Email" />
		<Input name="password" type="password" placeholder="Password" />
		<Button>Log in</Button>
	</form>
{:else}
	<pre>{JSON.stringify($page.data.session, null, 4)}</pre>
	<h1>Welcome {$page.data.session.user.email}</h1>
	<p>You are logged in!</p>
	<form method="POST" action="?/signout">
		<Button>Log out</Button>
	</form>
{/if}

<form method="POST" action="?/reset">
	<Input name="email" type="email" placeholder="Email" />
	<Button>Reset password</Button>
</form>
