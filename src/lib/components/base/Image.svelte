<script lang="ts">
	export let alt: string;
	export let src: string;
	const customClasses = $$restProps.class;
	let active: boolean = false;
</script>

<div
	on:click={() => (active = !active)}
	{...$$restProps}
	class={`
        cursor-pointer
        ${customClasses}
        ${active ? `z-50 fixed inset-0 p-4 md:p-12 xl:p-32 bg-black bg-opacity-80` : `max-w-3xl`}
        `}
>
	<p class={`text-lg p-4 text-white text-end pointer-events-none  ${active ? `block` : `hidden`}`}>
		Skjul billede
	</p>
	<img {alt} {src} class={`max-w-full mx-auto ${active ? `rounded-xl` : `rounded-lg`}`} />
</div>
