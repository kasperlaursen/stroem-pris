<script lang="ts">
	import { page } from '$app/stores';
	import {
		Button,
		Dropdown,
		DropdownItem,
		DropdownDivider,
		Navbar,
		NavBrand,
		NavHamburger,
		NavUl,
		NavLi
	} from 'flowbite-svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import {
		ArrowTrendingUp,
		Cog,
		Squares2x2,
		ArrowRightOnRectangle,
		ArrowLeftOnRectangle,
		Bolt
	} from '@steeze-ui/heroicons';
</script>

<Navbar color="none" let:hidden let:toggle>
	<NavBrand href="/">
		<h1
			class="relative text-2xl uppercase font-extrabold md:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-500"
		>
			<a href="/">
				<Icon
					src={Bolt}
					theme="solid"
					class={`h-[1em] w-[1em] inline text-cyan-400 align-top stroke-2 stroke-slate-50 dark:stroke-neutral-1000 translate-x-2`}
				/>Strømpris
			</a>
		</h1>
	</NavBrand>
	<NavHamburger on:click={toggle} />
	<NavUl {hidden}>
		<NavLi href="/" class="flex gap-2 items-center" active={$page.url.pathname === '/'}>
			<Icon src={ArrowTrendingUp} theme="solid" class={`h-4 w-4`} />
			Forside
		</NavLi>
		{#if !$page.data.session}
			<NavLi href="/login" class="flex gap-2 items-center" active={$page.url.pathname === '/login'}>
				<Icon src={ArrowLeftOnRectangle} theme="solid" class={`h-4 w-4`} />
				Log ind
			</NavLi>
		{:else}
			<NavLi
				href="/dashboard"
				class="flex gap-2 items-center"
				active={$page.url.pathname === '/dashboard'}
			>
				<Icon src={Squares2x2} theme="solid" class={`h-4 w-4`} />
				Dit overblik
			</NavLi>
			<NavLi
				href="/profile"
				class="flex gap-2 items-center"
				active={$page.url.pathname === '/profile'}
			>
				<Icon src={Cog} theme="solid" class={`h-4 w-4`} />
				Indstillinger
			</NavLi>
			<NavLi href="/logout" class="flex gap-2 items-center">
				<Icon src={ArrowRightOnRectangle} theme="solid" class={`h-4 w-4`} />
				Log ud
			</NavLi>
		{/if}
		<NavLi class="flex gap-2 items-center">
			<ThemeToggle />
		</NavLi>
	</NavUl>
</Navbar>
