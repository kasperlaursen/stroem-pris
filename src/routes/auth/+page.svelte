<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte';
	import Card from '$lib/components/Card/Card.svelte';
	import Fieldset from '$lib/components/Fieldset/Fieldset.svelte';
	import Input from '$lib/components/Input/Input.svelte';
	import Label from '$lib/components/Label/Label.svelte';
	import type { ActionData } from './$types';
	export let form: ActionData;
</script>

{#if form?.success === false}
	<p>{form.error.message}</p>
{/if}

<Card class="w-full max-w-md mx-auto self-center mt-20">
	<form method="POST" action="?/signin" class="grid gap-4">
		<Fieldset>
			<Label for="email">E-mail:</Label>
			<Input id="email" name="email" type="email" placeholder="john.doe@gmail.com" />
		</Fieldset>
		<Fieldset>
			<Label for="password">Kodeord:</Label>
			<Input id="password" name="password" type="password" placeholder="******" />
		</Fieldset>
		<Button type="submit">Log in</Button>
	</form>
</Card>
