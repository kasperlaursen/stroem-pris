<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Bolt } from '@steeze-ui/heroicons';
	import type { LogoVariant } from './types';

	export let variant: LogoVariant = 'full';
	$: text = variant === 'full' ? 'Strømpris' : 'S';
</script>

<h1
	class="relative text-2xl uppercase font-extrabold md:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-500"
>
	<a href="/">
		<Icon
			src={Bolt}
			theme="solid"
			class={`h-[1em] w-[1em] inline text-cyan-400 align-top stroke-2 stroke-slate-50 dark:stroke-neutral-900 translate-x-2`}
		/>{text}
	</a>
</h1>
