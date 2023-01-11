<script lang="ts">
	const customClasses = $$restProps.class;
</script>

<div
	{...$$restProps}
	class={`
        ${customClasses ?? ''}
        grid
    `}
>
	<slot />
</div>
