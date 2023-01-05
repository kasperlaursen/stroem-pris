<script lang="ts">
	const customClasses = $$restProps.class;
	export let value: string;
</script>

<option
	{...$$restProps}
	{value}
	class={`
        ${customClasses ?? ''}
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
</option>
