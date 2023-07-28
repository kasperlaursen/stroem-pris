<script lang="ts">
  import Option from "$lib/components/Select/Option.svelte";
  import Select from "$lib/components/Select/Select.svelte";
  import type { PriceAreas } from "$lib/data/spot/energidataservice/types";

  export let area: PriceAreas;

  let areaForm: HTMLFormElement;
  const handleChange = () => {
    areaForm.submit();
  };
</script>

<form method="get" action="/" data-sveltekit-reload bind:this={areaForm}>
  <Select id="area" name="area" data-testid="price-area-select" bind:value={area} on:change={handleChange}>
    <Option value="DK1">Vest for storebælt</Option>
    <Option value="DK2">Øst for storebælt</Option>
  </Select>
</form>
