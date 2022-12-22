<script lang="ts">
	import type { ActionData } from './$types';
	export let form: ActionData;
</script>

<main class="grid justify-items-center gap-4">
	<h1 class="text-2xl font-bold text-center">Velkommen til strømpris! 👋</h1>

	{#if form && form?.error}
		<p class="p-8">{form.error}</p>
	{/if}

	<div class="w-96 grid gap-4">
		<p>Udfyld venligst dit ønskede kodeord nedenfor for at færdiggøre oprettelsen af din bruger.</p>
		<form method="POST" action="?/setPassword" class="grid gap-4">
			<div>
				<label for="password" class="mb-2">Kodeord</label>
				<input type="password" id="password" name="password" placeholder="•••••••••" required />
			</div>
			<button type="submit">Opret Bruger</button>
		</form>
	</div>
</main>
