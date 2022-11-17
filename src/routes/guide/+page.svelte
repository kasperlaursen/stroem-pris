<script lang="ts">
	import Link from '$lib/components/base/Link.svelte';
	import Step2 from '$lib/assets/guide/Step2.jpg';
	import Step3 from '$lib/assets/guide/Step3.jpg';
	import Step4 from '$lib/assets/guide/Step4.jpg';
	import Step5 from '$lib/assets/guide/Step5.jpg';
	import Step6 from '$lib/assets/guide/Step6.jpg';
	import Step8 from '$lib/assets/guide/Step8.jpeg';
	import { Button, Card, Heading, Input, P } from 'flowbite-svelte';
	import Image from '$lib/components/base/Image.svelte';
	import type { PageData } from '.svelte-kit/types/src/routes/guide/$types';

	export let data: PageData;
	$: ({ hasToken, isUser, meterId } = data);
</script>

<Card size="xl" class="mx-auto gap-4">
	<Heading tag="h3">Kom godt igang</Heading>
	<P>
		For at vise data og lave beregninger på <b>dit elforbrug</b>, er der et par skridt vi skal
		igennem.
		<br />
		Dine forbrugs data hentes fra portalen <Link href="https://eloverblik.dk/">eloverblik.dk</Link> som
		drives af Energinet.
	</P>
	<P>Følg guiden herunder for at give strømpris.dk adgang til data om dit elforbrug.</P>

	<ol>
		<li class="grid gap-4 py-8">
			<Heading tag="h5" id="step-1">
				1. Besøg <Link href="https://eloverblik.dk/" target="_blank">eloverblik.dk</Link> og log ind
				med MitID.
			</Heading>
		</li>
		<li class="grid gap-4 py-8">
			<Heading tag="h5" id="step-2">
				2. Klik på "Bruger ikonet" i menu baren, og vælg punktet "DATADELING"
			</Heading>
			<Image class="mx-auto" alt="Showing where to click in the eloverblik ui" src={Step2} />
		</li>
		<li class="grid gap-4 py-8">
			<Heading tag="h5" id="step-3">3. Klik på "Opret Token" knappen</Heading>
			<Image class="mx-auto" alt="Showing where to click in the eloverblik ui" src={Step3} />
		</li>
		<li class="grid gap-4 py-8">
			<Heading tag="h5" id="step-4">4. Læs og accepter den vigtige informaion</Heading>
			<Image class="mx-auto" alt="Showing where to click in the eloverblik ui" src={Step4} />
		</li>
		<li class="grid gap-4 py-8">
			<Heading tag="h5" id="step-5">5. Giv din token en navn og tryk "Opret Token"</Heading>
			<Image class="mx-auto" alt="Showing where to click in the eloverblik ui" src={Step5} />
		</li>
		<li class="grid gap-4 py-8">
			<Heading tag="h5" id="step-6">
				6. Klik på "Kopier til udklipsholder" for at kopiere hele din token
			</Heading>
			<Image class="mx-auto" alt="Showing where to click in the eloverblik ui" src={Step6} />
		</li>
		{#if isUser}
			<li class="grid gap-4 py-8">
				<Heading tag="h5" id="step-7">7. Indsæt din token herunder og tryk "Gem Token"</Heading>

				<form method="POST" action="?/setToken" class="grid gap-4">
					<Input
						placeholder="Indsæt Token"
						disabled={hasToken}
						value={hasToken ? '**********' : ''}
						name="token"
						type="password"
						class="w-full"
					/>
					{#if hasToken}
						<P class="text-center">Din token er nu gemt</P>
					{:else}
						<Button type="submit" class="self-end">Gem Token</Button>
					{/if}
				</form>
			</li>

			<li class="grid gap-4 py-8">
				<Heading tag="h5" id="step-8">8. Kopier dit MålepunktsID fra Eloverblik</Heading>
				<P>Klik på ElOverblik logoet for at komme tilbage til startsiden.</P>
				<P>Har du mere end 1 målepunkt skal du kopiere ID for punktet "Forbrugt fra net".</P>
				<P>Ser du ikke mere end 1 målepunkt skal du kopiere det id du ser.</P>
				<Image class="mx-auto" alt="Showing where to click in the eloverblik ui" src={Step8} />
			</li>

			{#if hasToken}
				<li class="grid gap-4 py-8">
					<Heading tag="h5" id="step-9">
						9. Indsæt dit MålepunktsID herunder og tryk "Gem Målepunkt"
					</Heading>
					<form method="POST" action="?/setMeterId" class="grid gap-4">
						<Input value={meterId} name="meterid" type="text" class="w-full" />
						{#if meterId}
							<P class="text-center">Din MålepunktsID er nu gemt</P>
							<Link class="text-center" href="/dashboard">Se din data på siden: Mit Overblik</Link>
						{:else}
							<Button type="submit" class="self-end">Gem Målepunkt</Button>
						{/if}
					</form>
				</li>
			{/if}
		{:else}
			<li class="grid gap-4 py-8">
				<Heading tag="h5" id="step-7">Du skal være logget ind for at fortsætte.</Heading>
				<P>
					Der er på nuværende tidspunkt ikke åbnet for nye brugere. <br />
					Du er velkommen til at kontakte mig for at hører nærmere.
				</P>
			</li>
		{/if}
	</ol>
</Card>
