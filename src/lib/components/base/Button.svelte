<script lang="ts">
	import { buttonBaseClasses, buttonVariantClasses, type ButtonVariants } from './button';
	export let color: ButtonVariants = 'PRIMARY';
	const customClasses = $$restProps.class;
</script>

<button
	on:click
	on:focus
	on:mouseover
	on:mouseenter
	on:mouseleave
	{...$$restProps}
	class={`${customClasses} ${buttonBaseClasses} file:${buttonVariantClasses[color]}`}
>
	<slot />
</button>
