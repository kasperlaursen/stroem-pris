<script lang="ts">
	import type { ButtonTypes } from './types';

	const customClasses = $$restProps.class;
	const type: ButtonTypes = 'button';
</script>

<button
	{...$$restProps}
	{type}
	on:click
	on:keydown
	class={`
        ${customClasses ?? ''}
        text-sm
		rounded
		p-1
		px-3
		text-primary-50
		font-medium
		bg-primary-500
		hover:bg-primary-600
		transition
    `}
>
	<slot />
</button>
