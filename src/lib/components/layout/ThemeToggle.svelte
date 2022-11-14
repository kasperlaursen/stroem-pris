<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Sun, Moon } from '@steeze-ui/heroicons';
	import { theme } from '$lib/stores';

	const clickHandler = () => {
		theme.set($theme === 'light' ? 'dark' : 'light');
	};
</script>

<div on:keypress on:click={clickHandler}>
	<Icon
		src={$theme === 'light' ? Moon : Sun}
		theme="solid"
		class={`${$theme === 'light' ? 'text-teal-800' : 'text-amber-500'} h-5 w-5 cursor-pointer`}
	/>
</div>
