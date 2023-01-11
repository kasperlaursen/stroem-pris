<script lang="ts">
	const customClasses = $$restProps.class;
	export let htmlFor: string = '';
</script>

<label
	{...$$restProps}
	for={htmlFor}
	class={`
        ${customClasses ?? ''}
        text-sm
        m-1
    `}
>
	<slot />
</label>
