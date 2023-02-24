<script lang="ts">
	import { classFromProps } from '$lib/utils/classFromProps';

	const customClasses: string = classFromProps($$restProps);
</script>

<span
	{...$$restProps}
	class={`${customClasses} dark:text-white text-black font-medium group-hover:font-extrabold group-hover:scale-110 group-[.is-active]:font-bold`}
	><slot /></span
>
