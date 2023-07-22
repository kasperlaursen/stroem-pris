
<script lang="ts">
	import Card from '$lib/components/Card/Card.svelte';
	import Fieldset from '$lib/components/Fieldset/Fieldset.svelte';
	import Label from '$lib/components/Label/Label.svelte';
	import Option from '$lib/components/Select/Option.svelte';
	import Select from '$lib/components/Select/Select.svelte';
	import Toggle from '$lib/components/Toggle/Toggle.svelte';
	import { netCompaniesArray } from '$lib/data/fees/types';
	import { classFromProps } from '$lib/utils/classFromProps';
	import { userSettings } from '$lib/stores/userSettingsStore';
	import { cva } from 'class-variance-authority';

    const customClasses: string = classFromProps($$restProps);
    const container = cva(["grid", "gap-4"])
    
</script>

<Card {...$$restProps} class={container({class: customClasses})}>
    <Fieldset class="mb-4">
        <Label>Net selskab</Label>
        <!-- TODO Make this select get optiosn from supabase -->
        <Select id="netCompany" name="netCompany" bind:value={$userSettings.netCompany}>
            {#each netCompaniesArray as netCompany}
                <Option class="capitalize" value={netCompany}>{netCompany.replace('_', ' ')}</Option>
            {/each}
        </Select>
        <small>
            Find dit selskab på
            <a
                class="text-primary-500 underline hover:text-primary-400"
                target="_blank"
                href="https://greenpowerdenmark.dk/vejledning-teknik/nettilslutning/find-netselskab"
            >
                Greenpowerdenmark.dk
            </a>
        </small>
    </Fieldset>

    <!-- TODO Add PriceArea select to this page -->

    <Fieldset direction="inline">
        <Toggle
            id="includeTariff"
            name="includeTariff"
            bind:checked={$userSettings.includeTariff}
        />
        <Label htmlFor="includeTariff">Inkluder Nettarif</Label>
    </Fieldset>

    <Fieldset direction="inline">
        <Toggle id="includeVat" name="includeVat" bind:checked={$userSettings.includeVat} />
        <Label htmlFor="includeVat">Inkluder Moms</Label>
    </Fieldset>

    <Fieldset direction="inline">
        <Toggle id="includeTax" name="includeTax" bind:checked={$userSettings.includeTax} />
        <Label htmlFor="includeTax">Inkluder Elafgift</Label>
    </Fieldset>

    <Fieldset direction="inline">
        <Toggle id="includeFees" name="includeFees" bind:checked={$userSettings.includeFees} />
        <Label htmlFor="includeFees">Inkluder Gebyrer</Label>
    </Fieldset>
</Card>