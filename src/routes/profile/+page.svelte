<!-- src/routes/profile/+page.svelte -->
<script lang="ts">
	import Button from '$lib/components/base/Button.svelte';
	import Card from '$lib/components/base/Card.svelte';
	import Input from '$lib/components/base/Input.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	$: ({ user, hasToken } = data);
</script>

<div class="grid gap-4 sm:grid-cols-2 grid-cols-1">
	<Card>
		<h2 class="font-semibold mb-2 uppercase">Profil Information:</h2>
		<div class="key-value-gird pl-2 gap-x-4 gap-y-1">
			<b>Email:</b> <span>{user.email}</span>
			<b>Telefon:</b> <span>{user.phone || 'Unknown'}</span>
			<b>Oprettet:</b> <span>{new Date(user.created_at).toLocaleDateString()}</span>
			<b>Sidste login:</b> <span>{new Date(user.last_sign_in_at ?? '').toLocaleDateString()}</span>
		</div>
	</Card>

	<Card>
		<h2 class="font-semibold mb-2 uppercase">Datahub token:</h2>
		<p>
			Indsæt og gem din datahub token for at få adgang til funktioner baseret på målerdata. <br />
			<i>Din token gemmes i vores database og andre brugere vil ikke have adgang til den.</i>
		</p>
		<form method="POST" action="?/setToken" class="grid gap-4">
			<Input
				disabled={hasToken}
				value={hasToken ? '**********' : ''}
				name="token"
				type="password"
				class="w-full"
			/>
			<Button class="self-end" disabled={hasToken}>Gem Token</Button>
		</form>
		{#if hasToken}
			<form method="POST" action="?/deleteToken" class="grid gap-4">
				<b>Slet token</b>
				<p>
					Klik herunder for at slette din token. <br />
					Efter sletning kan du gemme en ny token ovenfor.
				</p>
				<Button class="self-end" color="DANGER">Slet Token</Button>
			</form>
		{/if}
	</Card>
</div>

<style>
	.key-value-gird {
		display: grid;
		grid-template-columns: auto 1fr;
	}
</style>
