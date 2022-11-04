/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: ({ colors }) => ({
				neutral: {
					1000: 'rgb(18 18 18 / var(--tw-bg-opacity))'
				},
				dark: colors.slate[200],
				light: colors.slate[800]
			})
		}
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/forms')({
			strategy: 'base' // Generate global styles
		})
	]
};
