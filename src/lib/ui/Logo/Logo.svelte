<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Bolt } from '@steeze-ui/heroicons';
	import type { LogoVariant } from './types';

	const customClasses = $$restProps.class;

	export let variant: LogoVariant = 'full';
	$: text = variant === 'full' ? 'Strømpris' : 'S';
</script>

<h1
	{...$$restProps}
	class={`
		${customClasses ?? ''}
		relative
		text-2xl
		uppercase
		font-extrabold
		md:text-3xl
		lg:text-4xl
		text-transparent
		bg-clip-text
		bg-gradient-to-r
		from-cyan-400
		to-emerald-500
	`}
>
	<a href="/" class="">
		<Icon
			src={Bolt}
			theme="solid"
			class={`
			h-[1em]
			w-[1em]
			absolute
			inline
			align-top
			stroke-2 
			text-cyan-400
			stroke-gray-50
			dark:stroke-neutral-800
			`}
		/> <span class={`pl-4 pr-3`}>{text}</span>
	</a>
</h1>
