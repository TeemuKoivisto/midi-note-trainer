<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import restore from '@iconify-icons/mdi/restore'

  import { writable } from 'svelte/store'

  import Checkbox from '$elements/Checkbox.svelte'
  import VirtualKeyboard from '$components/virtual-keyboard/VirtualKeyboard.svelte'

  import { inputsActions, inputs, midiInput } from '$stores/inputs'
  import { reset, persist } from '$stores/persist'
  import { keyboardActions } from '$stores/keyboard'

  const hidden = persist(writable(false), { key: 'inputs-hidden' })
  let fixedVelocity = $inputs.fixedVelocity ?? ''
  let fadeMs = $inputs.keyFadeTimeout
  let setKeys = false

  inputs.subscribe(inp => {
    fixedVelocity = inp.fixedVelocity ?? ''
    fadeMs = inp.keyFadeTimeout
  })

  function toggleVisibility() {
    hidden.update(h => !h)
  }
  function handleSetVelocity(
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement
    }
  ) {
    const { value } = e.currentTarget
    let int
    if (value) {
      try {
        int = parseInt(value)
      } catch (err) {}
    }
    if (int !== undefined && int >= 0 && int <= 127) {
      inputsActions.setInputValue('fixedVelocity', int)
    } else if (!value) {
      inputsActions.setInputValue('fixedVelocity', undefined)
    } else {
      fixedVelocity = $inputs.fixedVelocity || ''
    }
  }
  function handleSetUseHotkeys(
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement
    }
  ) {
    inputsActions.setInputValue('useHotkeys', e.currentTarget.checked)
    if (!e.currentTarget.checked) {
      setKeys = false
      keyboardActions.cancelCapture()
    }
  }
  function handleSetFadeTimeout(
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement
    }
  ) {
    try {
      const int = parseInt(e.currentTarget.value)
      inputsActions.setInputValue('keyFadeTimeout', int)
    } catch (err: any) {
      fadeMs = $inputs.keyFadeTimeout
    }
  }
  function handleReset() {
    inputsActions.setInputValue('useSound', true)
    inputsActions.setInputValue('fixedVelocity', undefined)
    inputsActions.setInputValue('useKeyboard', true)
    inputsActions.setInputValue('useHotkeys', true)
    inputsActions.setInputValue('useAutoOctave', true)
    inputsActions.setInputValue('keyFadeTimeout', 1500)
  }
</script>

<fieldset
  class={`${
    $$props.class || ''
  } relative flex flex-col min-w-[auto] max-w-full rounded border-2 px-4 pt-2 pb-4 my-4 text-sm`}
  class:collapsed={$hidden}
>
  <legend class="text-base">
    <button class="px-1 rounded hover:bg-gray-100" on:click={toggleVisibility}>I/O</button>
  </legend>
  <div
    class="absolute top-[-0.25rem] right-[0.5rem] flex items-center justify-center"
    class:hidden={$hidden}
  >
    <button class="rounded px-1 py-1 hover:bg-gray-200" on:click={handleReset}>
      <Icon icon={restore} width={16} />
    </button>
  </div>
  <div class="body" class:hidden={$hidden}>
    <div class="h-full flex flex-col">
      <label class="font-bold" for="device">Device</label>
      <input
        class="px-1 my-1 rounded w-50"
        id="device"
        disabled
        value={'data' in $midiInput ? $midiInput.data.name : $midiInput.err}
      />
      <div class="flex my-[auto]">
        <button class="btn-sm primary mr-2" on:click={inputsActions.openMidi}>Prompt</button>
        <button class="btn-sm primary" on:click={inputsActions.disableMidi}>Disable</button>
      </div>
    </div>
    <div class="flex flex-col h-full">
      <div class="my-1 flex justify-between items-center mr-12">
        <label class="font-bold" for="sound">Sound</label>
        <Checkbox
          id="sound"
          checked={$inputs.useSound}
          on:change={e => inputsActions.setInputValue('useSound', e.currentTarget.checked)}
        />
      </div>
      <div class="flex justify-between">
        <label class="font-bold" for="fixed-velocity">Fixed velocity</label>
        <input
          class="h-[20px] w-16"
          id="fixed-velocity"
          placeholder="0-127"
          bind:value={fixedVelocity}
          on:change={handleSetVelocity}
        />
      </div>
    </div>
    <div class="flex flex-col h-full">
      <div class="my-1 flex justify-between items-center mr-12">
        <label class="font-bold" for="keyboard">Keyboard</label>
        <Checkbox
          id="keyboard"
          checked={$inputs.useKeyboard}
          on:change={e => inputsActions.setInputValue('useKeyboard', e.currentTarget.checked)}
        />
      </div>
      <div class="my-1 flex justify-between items-center mr-12">
        <label class="font-bold" for="hotkeys">Hotkeys</label>
        <Checkbox id="hotkeys" checked={$inputs.useHotkeys} on:change={handleSetUseHotkeys} />
      </div>
      <div class="my-1 flex justify-between items-center mr-12">
        <label class="font-bold" for="auto-octave">Auto-octave</label>
        <Checkbox
          id="auto-octave"
          checked={$inputs.useAutoOctave}
          on:change={e => inputsActions.setInputValue('useAutoOctave', e.currentTarget.checked)}
        />
      </div>
    </div>
    <div class="flex flex-col h-full">
      <div class="h-[28px]">&nbsp;</div>
      <div class="my-[2px] flex justify-between">
        <button
          class="w-full btn-sm primary"
          disabled={!$inputs.useHotkeys}
          on:click={() => (setKeys = !setKeys)}>Set hotkeys</button
        >
      </div>
      <div class="my-1 flex justify-between">
        <label class="font-bold" for="fade-timeout">Fade timeout</label>
        <input
          class="h-[20px] w-16"
          id="fade-timeout"
          value={fadeMs}
          on:input={handleSetFadeTimeout}
        />
      </div>
    </div>
  </div>
  {#if setKeys && !$hidden}
    <h4 class="mt-4 font-bold text-lg">Hotkeys</h4>
    <VirtualKeyboard />
  {/if}
</fieldset>

<style lang="scss">
  .collapsed {
    @apply py-0.5;
  }
  .body {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: auto;
    align-items: center;
    @media (width <= 656px) {
      grid-template-columns: 1fr 1fr;
    }
    @media (width <= 396px) {
      grid-template-columns: 1fr;
    }
    &.hidden {
      display: none;
    }
  }
  .error {
    @apply text-xs text-red-500;
  }
</style>
