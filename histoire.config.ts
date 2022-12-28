import { defineConfig } from 'histoire';
import { HstSvelte } from '@histoire/plugin-svelte';

export default defineConfig({
	plugins: [HstSvelte()],
	setupFile: '/src/histoire.setup.ts',
	tree: {
		groups: [
			{
				title: 'Components',
				include: (file) => true
			},
			{
				id: 'SpotChart',
				title: 'SpotChart'
			}
		]
	}
});
