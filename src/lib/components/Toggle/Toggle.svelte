<script lang="ts">
	import { cva } from 'class-variance-authority';
	import { classFromProps } from '$lib/utils/classFromProps';
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

	const track = cva(
		['w-12', 'h-6', 'rounded-full', 'shadow-inner', 'group-focus-within:shadow-outline'],
		{
			variants: {
				disabled: {
					true: ['bg-gray-500'],
					false: ['']
				},
				checked: {
					true: ['transform', 'transition-colors', 'bg-primary-500'],
					false: ['bg-gray-600']
				}
			}
		}
	);

	const thumb = cva(
		[
			'transition-all',
			'duration-300',
			'ease-in-out',
			'absolute',
			'top-0',
			'left-0',
			'w-6',
			'h-6',
			'bg-white',
			'border-2',
			'border-gray-600',
			'rounded-full'
		],
		{
			variants: {
				disabled: {
					true: ['bg-gray-100', 'border-gray-500'],
					false: ['']
				},
				checked: {
					true: ['transform', 'translate-x-full', 'border-primary-500'],
					false: ['']
				}
			}
		}
	);
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
	<div class={track({ disabled, checked })} />
	<div class={thumb({ disabled, checked })} />
</label>
