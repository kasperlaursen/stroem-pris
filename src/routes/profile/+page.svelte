<!-- src/routes/profile/+page.svelte -->
<script lang="ts">
	import Link from '$lib/components/base/Link.svelte';
	import { Button, Card, Heading, Hr, Input, P } from 'flowbite-svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	$: ({ user, hasToken } = data);
</script>

<div class="grid gap-4 sm:grid-cols-2 grid-cols-1">
	<Card class="min-w-full gap-4">
		<Heading customSize="text-xl font-semibold" tag="h2" class="font-semibold mb-2">
			Din Information:
		</Heading>
		<div class="key-value-gird pl-2 gap-x-4 gap-y-1 place-content-start">
			<P weight="bold">Email:</P>
			<P>{user.email}</P>
			<P weight="bold">Telefon:</P>
			<P>{user.phone || 'Unknown'}</P>
			<P weight="bold">Oprettet:</P>
			<P>{new Date(user.created_at).toLocaleDateString()}</P>
			<P weight="bold">Sidste login:</P>
			<P>{new Date(user.last_sign_in_at ?? '').toLocaleDateString()}</P>
		</div>
	</Card>

	<Card class="min-w-full gap-4">
		<Heading customSize="text-xl font-semibold" tag="h2" class="font-semibold mb-2">
			Eloverblik integration
		</Heading>
		<P>
			Indsæt og gem din datahub token for at få adgang til funktioner baseret på målerdata. <br />
			<i>Din token gemmes i vores database, andre brugere vil ikke have adgang til den.</i>
		</P>
		<P>Ved du ikke hvordan du får din Token? <Link href="/guide">Følg vores nemme guide</Link></P>
		<form method="POST" action="?/setToken" class="grid gap-4">
			<Input
				disabled={hasToken}
				value={hasToken ? '**********' : ''}
				name="token"
				type="password"
				class="w-full"
			/>
			<Button type="submit" class="self-end" disabled={hasToken}>Gem Token</Button>
		</form>
		{#if hasToken}
			<form method="POST" action="?/deleteToken" class="grid gap-4">
				<Heading tag="h6">Slet token</Heading>
				<P>
					Klik herunder for at slette din token. <br />
					Efter sletning kan du gemme en ny token ovenfor.
				</P>
				<Button type="submit" class="self-end" color="red">Slet Token</Button>
			</form>
			<Hr class="m-2" />

			<Heading tag="h5" class="font-semibold mb-2">Målepunkt ID</Heading>
			<P>
				Udfylde feltet med dit målepunkt ID fra eloverblik. <br />
				Har du flere målepinkter i eloverblik, skal du vælge måleunktetet "Forbrugt fra net".
			</P>
			<form method="POST" action="?/setMeterId" class="grid gap-4">
				<Input value={data.meterId} name="meterid" type="text" class="w-full" />
				<Button type="submit" class="self-end">Gem Målepunkt</Button>
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
