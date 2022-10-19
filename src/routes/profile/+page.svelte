<!-- src/routes/profile/+page.svelte -->
<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	$: ({ user, tableData } = data);
</script>

<div>Profile for {user.email}</div>
<pre>{JSON.stringify(tableData, null, 2)}</pre>
<pre>{JSON.stringify(user, null, 2)}</pre>

<form method="POST" action="?/updateProfile">
	<textarea name="profileText" rows="10" value={tableData?.[0]?.profile_text || ''} />
	<Button>Save Profile Text</Button>
</form>
