<script lang="ts">
    import type { PriceAreas } from "$lib/data/spot/energidataservice/types";
    import PriceAreaForm from "./PriceAreaForm.svelte";

    export let area: PriceAreas;

</script>

<div class="flex justify-between items-center p-2">
    <h1 class="font-medium text-gray-800 dark:text-gray-200">
        Variabel Strømpris
    </h1>
    <PriceAreaForm {area} />
</div>