<script lang="ts">
	import { page } from '$app/stores';
	import Input from '$lib/components/base/Input.svelte';
	import Button from '$lib/components/base/Button.svelte';
	import type { ActionData } from '.svelte-kit/types/src/routes/$types';
	import Card from '$lib/components/base/Card.svelte';
	import Alert from '$lib/components/base/Alert.svelte';
	import Link from '$lib/components/base/Link.svelte';

	export let form: ActionData;
	let showReset: boolean = false;
	function handleClick() {
		showReset = !showReset;
		console.log(showReset);
	}
</script>

<div class="max-w-sm m-auto mt-10 grid gap-2">
	{#if form && form?.error}
		<Alert title="Login failed!">
			<p class="mt-1 text-red-700">{form.error}</p>
		</Alert>
	{/if}

	<Card>
		<form method="POST" action="?/signin" class="grid gap-4">
			<Input name="email" type="email" placeholder="Email" />
			<Input name="password" type="password" placeholder="Password" />
			<Button>Log in</Button>
		</form>
	</Card>
	<Link href="#" on:click={handleClick}>Forgot password?</Link>

	{#if showReset}
		<Card>
			<form method="POST" action="?/reset" class="flex gap-4">
				<Input name="email" type="email" placeholder="Email" class="grow" />
				<Button>Reset password</Button>
			</form>
		</Card>
	{/if}
</div>
