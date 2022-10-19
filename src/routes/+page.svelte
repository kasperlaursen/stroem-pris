<script lang="ts">
	import { page } from '$app/stores';
	import type { ActionData } from '.svelte-kit/types/src/routes/$types';

	export let form: ActionData;
</script>

{#if !$page.data.session}
	<h1>I am not logged in</h1>

	{#if form && form?.error}
		<div>
			<p>Login failed...</p>
			<p>{form.error}</p>
		</div>
	{/if}

	<form method="POST" action="?/signin">
		<input name="email" type="email" />
		<input name="password" type="password" />
		<button>Log in</button>
	</form>
{:else}
	<pre>{JSON.stringify($page.data.session, null, 4)}</pre>
	<h1>Welcome {$page.data.session.user.email}</h1>
	<p>I am logged in!</p>
	<form method="POST" action="?/signout">
		<button>Log out</button>
	</form>
{/if}

<form method="POST" action="?/reset">
	<input name="email" type="email" />
	<button>reset password</button>
</form>
