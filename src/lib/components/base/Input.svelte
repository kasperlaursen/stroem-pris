<script lang="ts">
	const customClasses = $$restProps.class;
</script>

<input
	{...$$restProps}
	class={`px-3
        py-2
        text-sm
        font-normal
        text-gray-700
        bg-white 
        bg-clip-padding
        border 
        border-solid 
        border-gray-300
        rounded
        transition
        ease-in-out
				box-border
        m-0
        focus:text-gray-700 
        focus:bg-white 
        focus:border-blue-600 
        focus:outline-none
        ${customClasses}
      `}
/>
