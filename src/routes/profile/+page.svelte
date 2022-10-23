<!-- src/routes/profile/+page.svelte -->
<script lang="ts">
	import Button from '$lib/components/base/Button.svelte';
	import Card from '$lib/components/base/Card.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	$: ({ user, tableData } = data);
</script>

<div class="grid gap-4 sm:grid-cols-2 grid-cols-1">
	<Card>
		<h2 class="font-semibold mb-2 uppercase">Profile Info:</h2>
		<div class="key-value-gird pl-2 gap-x-4 gap-y-1">
			<b>Email:</b> <span>{user.email}</span>
			<b>Phone:</b> <span>{user.phone || 'Unknown'}</span>
			<b>Joined:</b> <span>{new Date(user.created_at).toLocaleDateString()}</span>
			<b>Last login:</b> <span>{new Date(user.last_sign_in_at ?? '').toLocaleDateString()}</span>
		</div>
	</Card>

	<Card>
		<h2 class="font-semibold mb-2 uppercase">Profile Text:</h2>
		<form method="POST" action="?/updateProfile" class="grid gap-4">
			<textarea
				name="profileText"
				rows="4"
				class="w-full"
				value={tableData?.[0]?.profile_text || ''}
			/>
			<Button class="self-end">Save Profile Text</Button>
		</form>
	</Card>
</div>

<style>
	.key-value-gird {
		display: grid;
		grid-template-columns: auto 1fr;
	}
</style>
