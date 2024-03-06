<script lang="ts">
  import { onMount } from 'svelte'

  import MultiSelectDropdown from '$elements/MultiSelectDropdown.svelte'
  import VirtualKey from './VirtualKey.svelte'

  import { keyboardOptions, keys, keyMap, keyboardActions } from '$stores/keyboard'
  import { LAYOUTS, importLayout } from '@/keyboard'

  onMount(async () => {
    console.log($keyMap)
    const layout = await importLayout(['sw'])
    console.log(layout)
    // @ts-ignore
    window.layout = layout
  })

  let middleRow = true
  let twoRows = false

  const langOptions = Object.entries(LAYOUTS).map(([k, v]) => ({
    key: k,
    value: v.name
  }))
  function handleSelectScale(key: string) {
    console.log('key ', key)
    keyboardActions.setLayout(key)
    return false
  }
</script>

<div class={`${$$props.class || ''} `}>
  <div class="flex">
    <div class="my-1 flex items-center justify-between mr-12">
      <label class="font-bold mr-4" for="middle-row">Layout</label>
      <MultiSelectDropdown
        id="keyboard-lang"
        class="p-1"
        options={langOptions}
        onSelect={handleSelectScale}
      >
        <div slot="value">{$keyboardOptions.layout.name}</div>
      </MultiSelectDropdown>
    </div>
    <div class="my-1 flex items-center justify-between mr-12">
      <label class="font-bold mr-4" for="middle-row">Middle-row</label>
      <input class="h-[20px]" id="middle-row" type="checkbox" bind:checked={middleRow} />
    </div>
    <div class="my-1 flex items-center justify-between mr-12">
      <label class="font-bold mr-4" for="two-rows">Two rows</label>
      <input class="h-[20px]" id="two-rows" type="checkbox" bind:checked={twoRows} />
    </div>
  </div>
  <div class="flex flex-col gap-1.5">
    <ul class="keyboard">
      {#each $keys as row, ridx}
        <li class="col-span-2"></li>
        {#each row as vkey}
          <VirtualKey value={vkey} />
        {/each}
      {/each}
    </ul>
  </div>
</div>

<style lang="scss">
  ul {
    @apply h-48;
    li {
      @apply m-[0.175rem] shadow bg-[#ececf1] rounded flex items-center justify-center;
    }
  }
  .keyboard {
    display: grid;
    grid-template-columns: 2fr repeat(62, 1fr);
    grid-template-rows: auto;
  }
</style>
