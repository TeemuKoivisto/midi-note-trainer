<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import circle from '@iconify-icons/mdi/chevron-right'
  import { onMount } from 'svelte'

  import MultiSelectDropdown from '$elements/MultiSelectDropdown.svelte'
  import VirtualKey from './VirtualKey.svelte'

  import {
    capturingHotkeys,
    keyboardSettings,
    keys,
    keyMap,
    keyboardActions
  } from '$stores/keyboard'
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
  $: settableRows = $keys.map((_, idx) =>
    $keyboardSettings.kbdOpts.hotkeydRows === 'middle-row' ? idx === 1 || idx === 2 : true
  )

  const langOptions = Object.entries(LAYOUTS).map(([k, v]) => ({
    key: k,
    value: v.name
  }))
  function handleSelectScale(key: string) {
    keyboardActions.setLayout(key)
    return false
  }
  function handleUseCustomLayout(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    keyboardActions.setCustomLayout(e.currentTarget.checked)
  }
  function handleSetRowKeys(rowIndex: number) {
    keyboardActions.captureHotkeyRow(rowIndex)
  }
</script>

<div class={`${$$props.class || ''} `}>
  <div class="flex">
    <div class="my-1 flex items-center justify-between mr-2">
      <label class="font-bold mr-4" for="middle-row">Layout</label>
      <MultiSelectDropdown
        id="keyboard-lang"
        containerClass="w-36"
        class="p-1"
        options={langOptions}
        onSelect={handleSelectScale}
      >
        <div slot="value">{$keyboardSettings.kbdOpts.layout.name}</div>
      </MultiSelectDropdown>
    </div>
    <div class="my-1 flex items-center justify-between mr-12">
      <label class="font-bold mr-4" for="custom-layout">Custom</label>
      <input
        class="h-[20px]"
        id="custom-layout"
        type="checkbox"
        checked={$keyboardSettings.useCustom}
        on:change={handleUseCustomLayout}
      />
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
        <li class="col-span-2">
          {#if settableRows[ridx]}
            <button
              class="flex items-center justify-center rounded w-full h-full hover:bg-gray-300"
              on:click={() => handleSetRowKeys(ridx)}
            >
              <Icon icon={circle} width={20} />
            </button>
          {/if}
        </li>
        {#each row as vkey, idx}
          <VirtualKey
            value={vkey}
            captured={($capturingHotkeys &&
              $capturingHotkeys.rowIndex === ridx &&
              $capturingHotkeys.nextIndex === idx) ||
              false}
          />
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
