<script lang="ts">
	import { classFromProps } from '$lib/utils/classFromProps';
	const customClasses: string = classFromProps($$restProps);
	export let id: string;
	export let disabled = false;
	export let checked: boolean;
</script>

<label
	{...$$restProps}
	for={id}
	class={`
	  ${customClasses}
	  relative inline-block align-middle cursor-pointer select-none bg-transparent group
  `}
>
	<input {id} name={id} type="checkbox" class="sr-only" {disabled} bind:checked />
	<div
		class={`
			w-12
			h-6
			rounded-full
			shadow-inner
			group-focus-within:shadow-outline
			${checked ? 'transform transition-colors bg-primary-500' : 'bg-gray-600'} 
			${disabled ? 'bg-gray-500' : ''}
		`}
	/>
	<div
		class={`
			transition-all
			duration-300
			ease-in-out
			absolute
			top-0
			left-0
			w-6
			h-6
			bg-white
			border-2
			border-gray-600
			rounded-full 
			${checked ? 'transform translate-x-full border-primary-500' : ''} 
			${disabled ? 'bg-gray-100 border-gray-500' : ''}
		`}
	/>
</label>
