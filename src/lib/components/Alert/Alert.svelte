<script lang="ts">
	import type { Vairants } from './types';

	const customClasses = $$restProps.class;

	export let title: string | null = null;
	export let variant: Vairants = 'danger';

	const variantClasses: { [key in Vairants]: string } = {
		danger: 'border-red-500 bg-red-50 text-red-700',
		warning: 'border-yellow-500 bg-yellow-50 text-yellow-700',
		info: 'border-sky-500 bg-sky-50 text-sky-700',
		neutral: 'border-slate-500 bg-slate-50 text-slate-700'
	};
</script>

<div
	{...$$restProps}
	role="alert"
	class={`
        ${customClasses}
        ${variantClasses[variant]}
        grid
        rounded
        border-l-4
        p-4
        gap-2
    `}
>
	{#if title}
		<strong class="block font-semibold ">{title}</strong>
	{/if}
	<p class="text-sm ">
		<slot />
	</p>
</div>
