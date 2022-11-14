<script lang="ts">
	import type { ActionData } from '.svelte-kit/types/src/routes/$types';
	import { Card, Heading, Input, Button, Label, P, InputAddon, ButtonGroup } from 'flowbite-svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Key } from '@steeze-ui/heroicons';

	export let form: ActionData;
</script>

<main class="grid justify-items-center gap-4">
	<Heading customSize="text-2xl font-bold" class="text-center">Velkommen til strømpris! 👋</Heading>

	{#if form && form?.error}
		<div>
			<p>Password set failed...</p>
			<p>{form.error}</p>
		</div>
	{/if}

	<Card class="w-96 grid gap-4">
		<P>Udfyld venligst dit ønskede kodeord nedenfor for at færdiggøre oprettelsen af din bruger.</P>
		<form method="POST" action="?/setPassword" class="grid gap-4">
			<div>
				<Label for="password" class="mb-2">Kodeord</Label>
				<ButtonGroup class="w-full">
					<InputAddon>
						<Icon src={Key} theme="solid" class="h-4 w-4" />
					</InputAddon>
					<Input type="password" id="password" name="password" placeholder="•••••••••" required />
				</ButtonGroup>
			</div>
			<Button type="submit">Opret Bruger</Button>
		</form>
	</Card>
</main>
