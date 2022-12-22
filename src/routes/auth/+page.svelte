<script lang="ts">
	import type { ActionData } from './$types';
	import Login from './components/login.svelte';
	export let form: ActionData;
</script>

{#if form?.success === false}
	<p>{form.error.message}</p>
{/if}

<Login />
