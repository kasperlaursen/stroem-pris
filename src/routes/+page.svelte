<script lang="ts">
	import { page } from '$app/stores';
</script>

{#if $page.data.session}
	<h1>Welcome {$page.data.session.user.email}</h1>
{/if}
