<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import circle from '@iconify-icons/mdi/chevron-right'
  import restore from '@iconify-icons/mdi/restore'

  import { onMount } from 'svelte'
  import { LAYOUTS } from '@/keyboard'

  import Dropdown from '$elements/Dropdown.svelte'
  import Toggle from '$elements/Toggle.svelte'
  import VirtualKey from './VirtualKey.svelte'

  import { keyboard, keyboardOptions, rows, keyboardActions } from '$stores/keyboard'

  onMount(() => {
    keyboardActions.setLayout(navigator.languages)
  })

  $: settableRows = $rows.map((_, idx) =>
    $keyboardOptions.hotkeydRows === 'middle-row' ? idx === 1 || idx === 2 : true
  )
  $: useMiddleRow = $keyboardOptions.hotkeydRows === 'middle-row'

  const langOptions = Object.entries(LAYOUTS).map(([k, v]) => ({
    key: k,
    value: v.name
  }))

  function handleReset() {
    keyboardActions.reset()
    keyboardActions.setLayout(navigator.languages)
  }
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
    <div class="options">
      <div class="my-1 flex items-center justify-between mr-2">
        <label class="font-bold mr-4" for="middle-row">Layout</label>
        <Dropdown
          id="keyboard-lang"
          containerClass="w-36"
          class="p-1 w-36"
          options={langOptions}
          onSelect={handleSelectLanguage}
        >
          <div slot="value">{$keyboardOptions.layout.name}</div>
        </Dropdown>
      </div>
      <div class="my-1 flex items-center">
        <label class="font-bold mr-4" for="custom-layout">Custom</label>
        <input
          class="h-[20px]"
          id="custom-layout"
          type="checkbox"
          checked={$keyboardOptions.isCustom}
          on:change={handleUseCustomLayout}
        />
      </div>
      <div class="my-1 flex items-center">
        <label class="font-bold mr-4" for="two-rows">One row</label>
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
  <div class="flex flex-col">
    <ul class="keyboard">
      {#each $keyboard.rows as row, ridx}
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
        {#each row as _, idx}
          <VirtualKey rowIndex={ridx} keyIndex={idx} />
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
  .options {
    display: grid;
    grid-template-columns: 1fr 1fr 2fr;
    @media (width <= 656px) {
      grid-template-columns: 1fr;
    }
  }
  .keyboard {
    display: grid;
    grid-template-columns: 2fr repeat(61, 1fr);
    grid-template-rows: auto;
  }
</style>
