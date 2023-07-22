module.exports = {
	"useTabs": true,
	"singleQuote": true,
	"trailingComma": "none",
	"printWidth": 100,    
	pluginSearchDirs: false, // you can omit this when using Prettier version 3
    plugins: [require('prettier-plugin-svelte')],
    overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }],
}
