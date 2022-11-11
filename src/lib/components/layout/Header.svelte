<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/base/Button.svelte';
	import Link from '$lib/components/base/Link.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Cog, Squares2x2, ArrowRightOnRectangle, Bolt } from '@steeze-ui/heroicons';
</script>

<header
	class="flex flex-col md:flex-row md:justify-between gap-4 items-center w-full p-4 bg-transparent "
>
	<h1
		class="text-2xl uppercase font-extrabold md:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-500"
	>
		<a href="/">
			<Icon
				src={Bolt}
				theme="solid"
				class={`h-[1em] w-[1em] inline text-cyan-400 align-top stroke-2 stroke-slate-50 dark:stroke-neutral-1000 translate-x-2`}
			/>Strømpris</a
		>
	</h1>

	<span class="flex gap-4">
		{#if !$page.data.session}
			<Link href="/login" color="PRIMARY" title="Log ind">Log ind</Link>
		{:else}
			<Link color="SECONDARY" href="/profile" title="Indstillinger">
				<Icon src={Cog} theme="solid" class={`h-4 w-4`} />
			</Link>
			<Link color="SECONDARY" href="/dashboard" title="Personlig data">
				<Icon src={Squares2x2} theme="solid" class={`h-4 w-4`} />
			</Link>
			<form method="POST" action="/signout">
				<Button color="SECONDARY" title="Log ud" class="flex group">
					<Icon src={ArrowRightOnRectangle} theme="solid" class={`h-4 w-4`} />
				</Button>
			</form>
		{/if}
		<ThemeToggle />
	</span>
</header>
