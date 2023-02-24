<script lang="ts">
	import { classFromProps } from '$lib/utils/classFromProps';

	const customClasses: string = classFromProps($$restProps);
	export let href: string;
</script>

<a
	{...$$restProps}
	{href}
	class={`
	${customClasses}
		flex
        flex-col
        sm:flex-row
		gap-x-2
		gap-y-1
        p-2
        items-center
        whitespace-nowrap
		rounded-md

        uppercase
        font-medium

        text-[.5rem]
        sm:text-xs
        w-full
        
		text-gray-700
		dark:text-gray-300

        dark:hover:text-white
        dark:hover:bg-neutral-700 
        hover:bg-neutral-200 
        transition
	`}
>
	<slot name="icon" />
	<span>
		<slot />
	</span>
</a>
