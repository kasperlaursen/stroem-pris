<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Sun, Moon } from '@steeze-ui/heroicons';
	import Button from '../base/Button.svelte';

	import { theme } from '$lib/stores';

	const clickHandler = () => {
		theme.set($theme === 'light' ? 'dark' : 'light');
	};
</script>

<Button color="SECONDARY" on:click={clickHandler}>
	<Icon
		src={$theme === 'light' ? Moon : Sun}
		theme="solid"
		class={`${$theme === 'light' ? 'color-gray-900' : 'color-gray-900'} h-4 w-4`}
	/>
</Button>
