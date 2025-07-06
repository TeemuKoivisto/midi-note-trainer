<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import circle from '@iconify-icons/mdi/chevron-right'
  import restore from '@iconify-icons/mdi/restore'

  import { onMount } from 'svelte'
  import { LAYOUTS } from '@/keyboard'

  import Checkbox from '$elements/Checkbox.svelte'
  import Dropdown from '$elements/Dropdown.svelte'
  import Toggle from '$elements/Toggle.svelte'
  import VirtualKey from './VirtualKey.svelte'

  import { keyboard, keyboardOptions, rows, keyboardActions } from '$stores/keyboard'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLDivElement> {}

  let props: Props = $props()

  onMount(() => {
    if (!$keyboard.opts.isCustom) {
      keyboardActions.setLayout(navigator.languages)
    }
  })

  let settableRows = $derived(
    $rows.map((_, idx) =>
      $keyboardOptions.hotkeydRows === 'middle-row' ? idx === 1 || idx === 2 : true
    )
  )
  let useMiddleRow = $derived($keyboardOptions.hotkeydRows === 'middle-row')

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

<div {...props} class={`${props.class || ''} relative`}>
  <div class="flex justify-between">
    <div class="options">
      <div class="my-1 mr-2 flex items-center justify-between">
        <label class="mr-4 font-bold" for="middle-row">Layout</label>
        <Dropdown
          id="keyboard-lang"
          containerClass="w-36"
          class="w-36 p-1"
          options={langOptions}
          onSelect={handleSelectLanguage}
        >
          <div slot="value">{$keyboardOptions.layout.name}</div>
        </Dropdown>
      </div>
      <div class="my-1 flex items-center">
        <label class="mr-4 font-bold" for="custom-layout">Custom</label>
        <Checkbox
          id="custom-layout"
          checked={$keyboardOptions.isCustom}
          onchange={handleUseCustomLayout}
        />
      </div>
      <div class="my-1 flex items-center">
        <label class="mr-4 font-bold" for="two-rows">One row</label>
        <Toggle checked={!useMiddleRow} onchange={handleToggleRows} />
        <label class="ml-4 font-bold" for="two-rows">Two rows</label>
      </div>
    </div>
    <div class="flex items-center justify-center">
      <button class="rounded px-1 py-1 hover:bg-gray-200" onclick={handleReset}>
        <Icon icon={restore} width={16} />
      </button>
    </div>
  </div>
  <div class="flex flex-col">
    <ul class="keyboard overflow-scroll">
      {#each $keyboard.rows as row, ridx}
        <li class="col-span-2 min-w-[24px]">
          {#if settableRows[ridx] && $keyboardOptions.isCustom}
            <button
              class="flex h-full w-full items-center justify-center rounded hover:bg-gray-300"
              onclick={() => handleSetRowKeys(ridx)}
            >
              <Icon icon={circle} width={20} />
            </button>
          {/if}
        </li>
        {#each row.keys as _, idx}
          <VirtualKey rowIndex={ridx} keyIndex={idx} />
        {/each}
      {/each}
    </ul>
  </div>
</div>

<style lang="postcss">
  @reference "#app.pcss";

  ul {
    @apply h-48;
    li {
      @apply m-[0.175rem] flex items-center justify-center rounded bg-[#ececf1] shadow;
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
