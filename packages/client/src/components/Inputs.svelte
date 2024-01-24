<script lang="ts">
  import { midiActions, midiInput, useKeyboard, useSound } from '$stores/midi'

  let hidden = false

  function handleToggleSound(
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement
    }
  ) {
    midiActions.setSound(e.currentTarget.checked)
  }
  function handleToggleKeyboard(
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement
    }
  ) {
    midiActions.setUseKeyboard(e.currentTarget.checked)
  }
  function toggleVisibility() {
    hidden = !hidden
  }
</script>

<div class={`${$$props.class || ''}`}>
  <fieldset class="flex flex-col rounded border-2 px-4 py-2 my-4 text-sm">
    <legend class="px-2 text-0A text-base">
      <button class="hover:bg-gray-100" on:click={toggleVisibility}>Controls</button>
    </legend>
    <div class="body" class:hidden>
      <div class="flex flex-col">
        <label class="font-bold" for="device">Device</label>
        <input class="my-1 w-50" id="device" disabled value={$midiInput?.name ?? 'No device'} />
        <div>
          <button class="btn primary" on:click={midiActions.openMidi}>Prompt</button>
        </div>
      </div>
      <div class="flex flex-col h-full">
        <label class="font-bold" for="sound">Sound</label>
        <div class="my-1 flex">
          <input
            class="h-[20px]"
            id="sound"
            type="checkbox"
            checked={$useSound}
            on:change={handleToggleSound}
          />
        </div>
      </div>
      <div class="flex flex-col h-full">
        <label class="font-bold" for="keyboard">Keyboard</label>
        <div class="my-1 flex">
          <input
            class="h-[20px]"
            id="keyboard"
            type="checkbox"
            checked={$useKeyboard}
            on:change={handleToggleKeyboard}
          />
        </div>
      </div>
    </div>
  </fieldset>
</div>

<style lang="scss">
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
