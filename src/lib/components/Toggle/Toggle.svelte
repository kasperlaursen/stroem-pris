<script lang="ts">
	import { cva } from 'class-variance-authority';
	import { classFromProps } from '$lib/utils/classFromProps';
	import Track from './Track.svelte';
	import Thumb from './Thumb.svelte';
	const customClasses: string = classFromProps($$restProps);
	export let id: string;
	export let disabled = false;
	export let checked: boolean;

	const toggle = cva([
		'relative',
		'inline-block',
		'align-middle',
		'cursor-pointer',
		'select-none',
		'bg-transparent',
		'group'
	]);
</script>

<label
	{...$$restProps}
	for={id}
	class={`
	  ${customClasses}
	  ${toggle()}
  `}
>
	<input {id} name={id} type="checkbox" class="sr-only" {disabled} bind:checked />
	<Track {disabled} {checked} />
	<Thumb {disabled} {checked} />
</label>
