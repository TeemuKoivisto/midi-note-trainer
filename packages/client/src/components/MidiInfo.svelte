<script lang="ts">
  import { midiActions, midiInput, midiRange } from '$stores/midi'
  import { getNote, parseNote } from '$utils/midi'

  let rangeMin = getNote($midiRange[0]).absolute
  let rangeMax = getNote($midiRange[1]).absolute
  let rangeError = ''

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
</script>

<div class={`${$$props.class || ''}`}>
  <fieldset class="flex flex-col rounded border-2 px-4 py-2 my-4 text-sm">
    <legend class="px-2 text-0A text-base">MIDI</legend>
    <div class="midi-body">
      <div class="flex flex-col">
        <label class="font-bold" for="device">Device</label>
        <input class="my-1 w-50" id="device" disabled value={$midiInput?.name ?? 'No device'} />
        <div>
          <button class="btn primary" on:click={midiActions.openMidi}>Prompt</button>
        </div>
      </div>
      <div class="flex flex-col">
        <label class="font-bold" for="range_min">Range</label>
        <div class="my-1 flex">
          <input
            class="w-10"
            id="range_min"
            bind:value={rangeMin}
            on:change={e => handleRangeChanged('min', e)}
          />
          <span class="mx-2">-</span>
          <input
            class="w-10"
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
        <label class="font-bold" for="sound">Sound</label>
        <div class="my-1 flex">
          <input class="w-10" id="sound" type="checkbox" value="false" />
        </div>
      </div>
    </div>
  </fieldset>
</div>

<style lang="scss">
  .midi-body {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: 25% 25% 25%;
    grid-template-rows: auto;
    align-items: center;
    @media (width <= 475px) {
      grid-template-columns: 50% 50%;
    }
  }
  .error {
    @apply text-xs text-red-500;
  }
</style>
