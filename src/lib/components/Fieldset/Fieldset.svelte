<script lang="ts">
	import { classFromProps } from '$lib/utils/classFromProps';

	const customClasses: string = classFromProps($$restProps);
</script>

<div
	{...$$restProps}
	class={`
        ${customClasses}
        grid
    `}
>
	<slot />
</div>
