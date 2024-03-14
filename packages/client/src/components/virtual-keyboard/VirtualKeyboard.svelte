<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import circle from '@iconify-icons/mdi/chevron-right'
  import restore from '@iconify-icons/mdi/restore'

  import { onMount } from 'svelte'

  import Dropdown from '$elements/Dropdown.svelte'
  import Toggle from '$elements/Toggle.svelte'
  import VirtualKey from './VirtualKey.svelte'

  import { capturingHotkeys, keyboardSettings, keys, keyboardActions } from '$stores/keyboard'
  import { LAYOUTS } from '@/keyboard'

  onMount(() => {
    keyboardActions.setLayout(navigator.languages)
  })

  let middleRow = true
  let twoRows = false
  $: settableRows = $keys.map((_, idx) =>
    $keyboardSettings.kbdOpts.hotkeydRows === 'middle-row' ? idx === 1 || idx === 2 : true
  )
  $: useMiddleRow = $keyboardSettings.kbdOpts.hotkeydRows === 'middle-row'

  const langOptions = Object.entries(LAYOUTS).map(([k, v]) => ({
    key: k,
    value: v.name
  }))

  function handleReset() {}
  function handleSelectLanguage(key: string) {
    keyboardActions.setLayout([key])
    return false
  }
  function handleUseCustomLayout(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    keyboardActions.setCustomLayout(e.currentTarget.checked)
  }
  function handleSetRowKeys(rowIndex: number) {
    keyboardActions.captureHotkeyRow(rowIndex)
  }
  function handleToggleRows() {
    keyboardActions.toggleRows()
  }
</script>

<div class={`${$$props.class || ''} relative`}>
  <div class="flex justify-between">
    <div class="flex">
      <div class="my-1 flex items-center justify-between mr-2">
        <label class="font-bold mr-4" for="middle-row">Layout</label>
        <Dropdown
          id="keyboard-lang"
          containerClass="w-36"
          class="p-1 w-36"
          options={langOptions}
          onSelect={handleSelectLanguage}
        >
          <div slot="value">{$keyboardSettings.kbdOpts.layout.name}</div>
        </Dropdown>
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
      <!-- <div class="my-1 flex items-center justify-between mr-12">
      <label class="font-bold mr-4" for="middle-row">Middle-row</label>
      <input class="h-[20px]" id="middle-row" type="checkbox" bind:checked={middleRow} />
    </div> -->
      <div class="my-1 flex items-center justify-between mr-12">
        <label class="font-bold mr-4" for="two-rows">One row</label>
        <!-- <input class="h-[20px]" id="two-rows" type="checkbox" bind:checked={twoRows} /> -->
        <Toggle checked={!useMiddleRow} on:change={handleToggleRows} />
        <label class="font-bold ml-4" for="two-rows">Two rows</label>
      </div>
    </div>
    <div class="flex items-center justify-center">
      <button class="rounded px-1 py-1 hover:bg-gray-200" on:click={handleReset}>
        <Icon icon={restore} width={16} />
      </button>
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
    grid-template-columns: 2fr repeat(61, 1fr);
    grid-template-rows: auto;
  }
</style>
