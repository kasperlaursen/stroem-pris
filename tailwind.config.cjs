/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {
			colors: ({ colors }) => ({
				gray: colors.neutral,
				blue: colors.cyan,
				neutral: {
					1000: 'rgb(18 18 18 / var(--tw-bg-opacity))'
				},
				dark: colors.slate[200],
				light: colors.slate[800]
			}),
			gridTemplateColumns: {
				'auto-fit-250': 'repeat(auto-fit, minmax(250px, 1fr))'
			}
		}
	},
	safelist: [
		{
			pattern: /row-span-(1|2|3|4|5|6)/
		}
	],
	plugins: [require('flowbite/plugin')]
};
