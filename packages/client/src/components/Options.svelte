<script lang="ts">
  import { midiActions, midiInput, midiRange } from '$stores/midi'
  import { getNote, parseNote } from '$utils/midi'

  let rangeMin = getNote($midiRange[0]).absolute
  let rangeMax = getNote($midiRange[1]).absolute
  let rangeError = ''
  let hidden = false

  function handleSetRange() {
    // prompt -> press the lowest note in your MIDI device
    // press the highest note in your MIDI device
  }
  function handleRangeChanged(
    rang: 'min' | 'max',
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement
    }
  ) {
    const parsed = parseNote(e.currentTarget.value)
    if ('data' in parsed) {
      const old = $midiRange
      const range = [
        rang === 'min' ? parsed.data : old[0],
        rang === 'max' ? parsed.data : old[1]
      ] as [number, number]
      midiActions.setMidiRange(range)
      rangeError = ''
    } else {
      rangeError = parsed.err
      if (rang === 'min') {
        rangeMin = getNote($midiRange[0]).absolute
      } else {
        rangeMax = getNote($midiRange[1]).absolute
      }
    }
  }
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
      <button class="hover:bg-gray-100" on:click={toggleVisibility}>Options</button>
    </legend>
    <div class="body" class:hidden>
      <div class="flex flex-col">
        <label class="font-bold" for="range_min">Range</label>
        <div class="my-1 flex w-full">
          <input
            class="w-full"
            id="range_min"
            bind:value={rangeMin}
            on:change={e => handleRangeChanged('min', e)}
          />
          <span class="mx-4">—</span>
          <input
            class="w-full"
            id="range_max"
            bind:value={rangeMax}
            on:change={e => handleRangeChanged('max', e)}
          />
        </div>
        <div>
          {#if rangeError}
            <div class="error">{rangeError}</div>
          {/if}
          <button class="btn primary" on:click={handleSetRange}>Use MIDI</button>
        </div>
      </div>
      <div class="flex flex-col h-full">
        <label class="font-bold" for="sound">Scales</label>
        <div class="my-1 flex"></div>
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
