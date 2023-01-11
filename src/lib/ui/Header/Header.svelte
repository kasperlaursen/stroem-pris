<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Squares2x2, UserCircle, InformationCircle, Home } from '@steeze-ui/heroicons';
	import Logo from '../Logo/Logo.svelte';
	import NavItem from './NavItem.svelte';

	const customClasses = $$restProps.class;
	export let isOnline: boolean = false;
</script>

<header
	{...$$restProps}
	class={`
	${customClasses ?? ''}
		fixed
		w-full
		bottom-0
		flex
		justify-between
		p-2
		gap-2

		sm:px-4
		sm:gap-4

		border-t
		sm:border-t-0
		sm:border-b
		sm:relative
		border-gray-200
		dark:border-neutral-700

		bg-white
		dark:bg-neutral-800
	`}
>
	<Logo class="hidden sm:block" />
	<nav
		class="grid gap-4 place-items-center grid-rows-1 grid-cols-4 sm:grid-cols-none w-full sm:w-min"
	>
		<NavItem href="/" class="col-start-1 row-start-1 sm:col-auto">
			<Icon slot="icon" src={Home} theme="solid" class="h-4 w-4" />
			Forside
		</NavItem>
		<NavItem href="/" class="col-start-3 row-start-1 sm:col-auto">
			<Icon slot="icon" src={InformationCircle} theme="solid" class="h-4 w-4" />
			Info
		</NavItem>
		{#if !isOnline}
			<NavItem href="/auth" class="col-start-4 row-start-1 sm:col-auto">
				<Icon slot="icon" src={UserCircle} theme="solid" class="h-4 w-4" />
				Log ind
			</NavItem>
		{:else}
			<NavItem href="/" class="col-start-2 row-start-1 sm:col-auto">
				<Icon slot="icon" src={Squares2x2} theme="solid" class="h-4 w-4" />
				Overblik
			</NavItem>
			<NavItem href="/" class="col-start-4 row-start-1 sm:col-auto">
				<Icon slot="icon" src={UserCircle} theme="solid" class="h-4 w-4" />
				Profil
			</NavItem>
		{/if}
	</nav>
</header>
