<script lang="ts">
	const customClasses = $$restProps.class;
	export let value: string;
</script>

<select
	{...$$restProps}
	bind:value
	on:change
	on:input
	on:keydown
	on:keypress
	on:keyup
	on:click
	on:focus
	on:blur
	class={`
            ${customClasses ?? ''}
            appearance-none
            text-sm
            py-1
            px-2
            m-1
            rounded-md
            border
            bg-white
            dark:bg-neutral-800
            border-gray-300
            dark:border-gray-600
            focus:ring-2
            focus:border-primary-500 
            focus:ring-primary-500
        `}
>
	<slot />
</select>

<style>
	select {
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23737373' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
		background-position: right 0.5em center;
		background-repeat: no-repeat;
		background-size: 1.5em 1.5em;
		padding-right: 2.5em !important;
		-webkit-print-color-adjust: exact;
		print-color-adjust: exact;
	}
</style>
