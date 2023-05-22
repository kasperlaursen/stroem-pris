<script lang="ts">
	import { cva } from 'class-variance-authority';
	import { classFromProps } from '$lib/utils/classFromProps';
	const customClasses: string = classFromProps($$restProps);
	export let disabled = false;
	export let checked: boolean;

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
</script>

<div class={track({ disabled, checked, class: customClasses })} />
