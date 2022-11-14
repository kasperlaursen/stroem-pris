<script lang="ts">
	import type { ActionData } from '.svelte-kit/types/src/routes/$types';
	import Link from '$lib/components/base/Link.svelte';
	import { Alert, Button, Card, Input, Label, P } from 'flowbite-svelte';

	export let form: ActionData;
	let showReset: boolean = false;
	function handleClick() {
		showReset = !showReset;
		console.log(showReset);
	}
</script>

<div class="max-w-sm m-auto mt-10 grid gap-2">
	{#if form && form?.error}
		<Alert color="red" title="Login failed!">
			{form.error}
		</Alert>
	{/if}

	<Card>
		<form method="POST" action="?/signin" class="grid gap-4">
			<Label for="email">E-mail:</Label>
			<Input id="email" name="email" type="email" placeholder="E-mail" />
			<Label for="password">Kodeord:</Label>
			<Input id="password" name="password" type="password" placeholder="Kodeord" />
			<Button type="submit">Log in</Button>
		</form>
	</Card>
	<Link href="#" on:click={handleClick}>Glemt dit kodeord?</Link>

	{#if showReset}
		<Card>
			<form method="POST" action="?/reset" class="grid gap-4">
				<Label for="email">E-mail:</Label>
				<Input id="email" name="email" type="email" placeholder="E-mail" class="grow" />
				<Button type="submit">Nulstil kodeord</Button>
			</form>
		</Card>
	{/if}
</div>
