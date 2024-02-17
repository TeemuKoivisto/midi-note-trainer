<script lang="ts">
  import { writable } from 'svelte/store'

  import { inputsActions, inputs, midiInput } from '$stores/inputs'
  import { persist } from '$stores/persist'
  import { fadeTimeout, scoreActions } from '$stores/score'

  const hidden = persist(writable(false), { key: 'inputs-hidden' })
  let fixedVelocity = $inputs.fixedVelocity ?? ''
  let fadeMs = $fadeTimeout

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
      fixedVelocity = int
    } else if (!value) {
      inputsActions.setInputValue('fixedVelocity', undefined)
      fixedVelocity = ''
    } else {
      fixedVelocity = $inputs.fixedVelocity || ''
    }
    inputsActions.setKeyboardFocus(true)
  }
  function handleSetFadeTimeout(
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement
    }
  ) {
    try {
      const int = parseInt(e.currentTarget.value)
      scoreActions.setFadeTimeout(int)
      fadeMs = int
    } catch (err: any) {
      fadeMs = $fadeTimeout
    }
  }
</script>

<div class={`${$$props.class || ''}`}>
  <fieldset class="flex flex-col rounded border-2 px-4 py-2 my-4 text-sm" class:collapsed={$hidden}>
    <legend class="text-base">
      <button class="px-1 rounded hover:bg-gray-100" on:click={toggleVisibility}>I/O</button>
    </legend>
    <div class="body" class:hidden={$hidden}>
      <div class="h-full flex flex-col">
        <label class="font-bold" for="device">Device</label>
        <input
          class="px-1 my-1 rounded w-50"
          id="device"
          disabled
          value={$midiInput?.name ?? 'No device'}
        />
        <div class="flex my-[auto]">
          <button class="btn-sm primary mr-2" on:click={inputsActions.openMidi}>Prompt</button>
          <button class="btn-sm primary" on:click={inputsActions.disableMidi}>Disable</button>
        </div>
      </div>
      <div class="flex flex-col h-full">
        <div class="my-1 flex justify-between mr-12">
          <label class="font-bold" for="sound">Sound</label>
          <input
            class="h-[20px]"
            id="sound"
            type="checkbox"
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
            on:focus={() => inputsActions.setKeyboardFocus(false)}
            on:change={handleSetVelocity}
          />
        </div>
      </div>
      <div class="flex flex-col h-full">
        <div class="my-1 flex justify-between mr-12">
          <label class="font-bold" for="keyboard">Keyboard</label>
          <input
            class="h-[20px]"
            id="keyboard"
            type="checkbox"
            checked={$inputs.useKeyboard}
            on:change={e => inputsActions.setInputValue('useKeyboard', e.currentTarget.checked)}
          />
        </div>
        <div class="my-1 flex justify-between mr-12">
          <label class="font-bold" for="hotkeys">Hotkeys</label>
          <input
            class="h-[20px]"
            id="hotkeys"
            type="checkbox"
            checked={$inputs.useHotkeys}
            on:change={e => inputsActions.setInputValue('useHotkeys', e.currentTarget.checked)}
          />
        </div>
        <div class="my-1 flex justify-between mr-12">
          <label class="font-bold" for="auto-octave">Auto-octave</label>
          <input
            class="h-[20px]"
            id="auto-octave"
            type="checkbox"
            checked={$inputs.useAutoOctave}
            on:change={e => inputsActions.setInputValue('useAutoOctave', e.currentTarget.checked)}
          />
        </div>
      </div>
      <div class="flex flex-col h-full">
        <label class="font-bold" for="fade-timeout">Fade timeout</label>
        <div class="my-1 flex">
          <input
            class="h-[20px]"
            id="fade-timeout"
            value={fadeMs}
            on:focus={() => inputsActions.setKeyboardFocus(false)}
            on:blur={() => inputsActions.setKeyboardFocus(true)}
            on:input={handleSetFadeTimeout}
          />
        </div>
      </div>
    </div>
  </fieldset>
</div>

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
    @media (width <= 475px) {
      grid-template-columns: 1fr 1fr;
    }
    &.hidden {
      display: none;
    }
  }
  .error {
    @apply text-xs text-red-500;
  }
</style>
