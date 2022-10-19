<script lang="ts">
	export let color: 'PRIMARY' | 'SECONDARY' = 'PRIMARY';
	const classNames = {
		PRIMARY:
			'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 hover:shadow-lg focus:bg-blue-700 focus:border-blue-700 active:bg-blue-800 active:border-blue-800',
		SECONDARY:
			'bg-slate-600 border-slate-600 text-white hover:bg-slate-700 hover:border-slate-700 hover:shadow-lg focus:bg-slate-700 focus:border-slate-700 active:bg-slate-800 active:border-slate-800'
	};
</script>

<button
	{...$$restProps}
	class={`border 
					border-solid 
					inline-block
					px-6
					py-2.5
					font-medium
					text-xs
					leading-tight
					uppercase
					rounded
					shadow-md
					focus:shadow-lg
					focus:outline-none
					focus:ring-0
					active:shadow-lg
					transition
					duration-150
					ease-in-out
					${classNames[color]}`}
>
	<slot />
</button>
