<script lang="ts">
	const customClasses = $$restProps.class;
</script>

<span {...$$restProps} class={`${customClasses ?? ''} dark:text-gray-400 text-gray-500`}
	><slot /></span
>
