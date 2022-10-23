<script lang="ts">
	import { buttonBaseClasses, buttonVariantClasses, type ButtonVariants } from './button';
	export let color: ButtonVariants = 'NONE';
	const baseClasses =
		color === 'NONE'
			? 'text-sky-600 hover:text-sky-700 focus:text-sky-700 active:text-sky-800'
			: buttonBaseClasses;
	const customClasses = $$restProps.class;
</script>

<a
	on:click
	on:focus
	on:mouseover
	on:mouseenter
	on:mouseleave
	href="./#"
	{...$$restProps}
	class={`${customClasses} ${baseClasses} ${buttonVariantClasses[color]}`}
>
	<slot />
</a>
