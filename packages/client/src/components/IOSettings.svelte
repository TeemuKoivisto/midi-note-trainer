<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import restore from '@iconify-icons/mdi/restore'

  import { writable } from 'svelte/store'

  import Checkbox from '$elements/Checkbox.svelte'
  import VirtualKeyboard from '$components/virtual-keyboard/VirtualKeyboard.svelte'

  import { inputsActions, inputs, midiInput, useVirtualPiano } from '$stores/inputs'
  import { reset, persist } from '$stores/persist'
  import { keyboardActions } from '$stores/keyboard'

  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLFieldSetElement> {}

  let props: Props = $props()
  const hidden = persist(writable(false), { key: 'inputs-hidden' })
  let fixedVelocity = $state($inputs.fixedVelocity ?? '')
  let fadeMs = $state($inputs.keyFadeTimeout)
  let setKeys = $state(false)

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
  function handleToggleSetHotkeys() {
    setKeys = !setKeys
    keyboardActions.cancelCapture()
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
  {...props}
  class={`${
    props.class || ''
  } relative my-4 flex min-w-[auto] max-w-full flex-col rounded border-2 px-4 pb-4 pt-2 text-sm`}
  class:collapsed={$hidden}
>
  <legend class="flex w-fit text-base">
    <button class="z-0 rounded px-1 hover:bg-gray-100" onclick={toggleVisibility}>I/O</button>
  </legend>
  <div
    class="absolute right-[0.5rem] top-[-0.25rem] flex items-center justify-center"
    class:hidden={$hidden}
  >
    <button class="rounded px-1 py-1 hover:bg-gray-200" onclick={handleReset}>
      <Icon icon={restore} width={16} />
    </button>
  </div>
  <div class="body" class:hidden={$hidden}>
    <div class="flex flex-col">
      <label class="font-bold" for="device">Device</label>
      <input
        class="w-50 my-1 rounded bg-[#f9f9f9] py-0.5 pl-[2px]"
        id="device"
        disabled
        value={'data' in $midiInput ? $midiInput.data.name : $midiInput.err}
      />
      <div class="my-[auto] mt-1 flex">
        <button class="btn-sm primary mr-2" onclick={inputsActions.openMidi}>Prompt</button>
        <button class="btn-sm primary" onclick={inputsActions.disableMidi}>Disable</button>
      </div>
    </div>
    <div class="flex flex-col">
      <div class="mb-1 mr-12 flex items-center justify-between">
        <label class="font-bold" for="sound">Sound</label>
        <Checkbox
          id="sound"
          checked={$inputs.useSound}
          onchange={e => inputsActions.setInputValue('useSound', e.currentTarget.checked)}
        />
      </div>
      <div class="my-1 mr-12 flex items-center justify-between">
        <label class="font-bold" for="virtual-piano">Virtual piano</label>
        <Checkbox
          id="virtual-piano"
          checked={$useVirtualPiano}
          onchange={e => inputsActions.setUseVirtualPiano(e.currentTarget.checked)}
        />
      </div>
      <div class="mt-1 flex justify-between">
        <label class="font-bold" for="fixed-velocity">Fixed velocity</label>
        <input
          class="h-[20px] w-16"
          id="fixed-velocity"
          placeholder="0-127"
          bind:value={fixedVelocity}
          onchange={handleSetVelocity}
        />
      </div>
    </div>
    <div class="flex flex-col">
      <div class="mb-1 mr-12 flex items-center justify-between">
        <label class="font-bold" for="keyboard">Keyboard</label>
        <Checkbox
          id="keyboard"
          checked={$inputs.useKeyboard}
          onchange={e => inputsActions.setInputValue('useKeyboard', e.currentTarget.checked)}
        />
      </div>
      <div class="my-1 mr-12 flex items-center justify-between">
        <label class="font-bold" for="hotkeys">Hotkeys</label>
        <Checkbox id="hotkeys" checked={$inputs.useHotkeys} onchange={handleSetUseHotkeys} />
      </div>
      <div class="my-1 mr-12 flex items-center justify-between">
        <label class="font-bold" for="auto-octave">Auto-octave</label>
        <Checkbox
          id="auto-octave"
          checked={$inputs.useAutoOctave}
          onchange={e => inputsActions.setInputValue('useAutoOctave', e.currentTarget.checked)}
        />
      </div>
    </div>
    <div class="flex flex-col">
      <div class="h-[24px]">&nbsp;</div>
      <div class="my-[2px] flex justify-between">
        <button
          class="btn-sm primary w-full"
          disabled={!$inputs.useHotkeys}
          onclick={handleToggleSetHotkeys}>Set hotkeys</button
        >
      </div>
      <div class="my-1 flex justify-between">
        <label class="font-bold" for="fade-timeout">Fade timeout</label>
        <input
          class="h-[20px] w-16"
          id="fade-timeout"
          value={fadeMs}
          oninput={handleSetFadeTimeout}
        />
      </div>
    </div>
  </div>
  {#if setKeys && !$hidden}
    <h4 class="mt-4 text-lg font-bold">Hotkeys</h4>
    <VirtualKeyboard />
  {/if}
</fieldset>

<style lang="postcss">
  @reference "#app.pcss";

  .collapsed {
    @apply py-0.5;
  }
  .body {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: auto;
    align-items: start;
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
