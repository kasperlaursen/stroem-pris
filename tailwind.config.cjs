/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: ({ colors }) => ({
				primary: colors.teal
			})
		}
	},
	plugins: []
};
