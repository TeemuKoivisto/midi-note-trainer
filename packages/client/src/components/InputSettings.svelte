<script lang="ts">
  import { writable } from 'svelte/store'

  import { midiActions, midiInput, inputs } from '$stores/inputs'
  import { persist } from '$stores/persist'
  import { fadeTimeout, scoreActions } from '$stores/score'

  const hidden = persist(writable(false), { key: 'inputs-hidden' })
  let fadeMs = $fadeTimeout

  function toggleVisibility() {
    hidden.update(h => !h)
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
    <legend class="px-2 text-0A text-base">
      <button class="hover:bg-gray-100" on:click={toggleVisibility}>Inputs</button>
    </legend>
    <div class="body" class:hidden={$hidden}>
      <div class="h-full flex flex-col">
        <label class="font-bold" for="device">Device</label>
        <input class="my-1 w-50" id="device" disabled value={$midiInput?.name ?? 'No device'} />
        <div>
          <button class="btn primary" on:click={midiActions.openMidi}>Prompt</button>
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
            on:change={e => midiActions.setInputValue('useSound', e.currentTarget.checked)}
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
            on:change={e => midiActions.setInputValue('useKeyboard', e.currentTarget.checked)}
          />
        </div>
        <div class="my-1 flex justify-between mr-12">
          <label class="font-bold" for="hotkeys">Hotkeys</label>
          <input
            class="h-[20px]"
            id="hotkeys"
            type="checkbox"
            checked={$inputs.useHotkeys}
            on:change={e => midiActions.setInputValue('useHotkeys', e.currentTarget.checked)}
          />
        </div>
        <div class="my-1 flex justify-between mr-12">
          <label class="font-bold" for="auto-octave">Auto-octave</label>
          <input
            class="h-[20px]"
            id="auto-octave"
            type="checkbox"
            checked={$inputs.useAutoOctave}
            on:change={e => midiActions.setInputValue('useAutoOctave', e.currentTarget.checked)}
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
