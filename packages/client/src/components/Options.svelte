<script lang="ts">
  import { writable } from 'svelte/store'
  import { scales } from '@/chords-and-scales'

  import { currentGame } from '$stores/game'
  import { inputsActions, midiRangeNotes } from '$stores/inputs'
  import { persist } from '$stores/persist'
  import { keyAndScale, scaleData, scoreActions } from '$stores/score'
  import { keys } from '$utils/guess_keys'
  import { getNoteAbsolute, parseNote } from '$utils/getNote'

  import MultiSelectDropdown from '$elements/MultiSelectDropdown.svelte'

  let rangeMin = getNoteAbsolute($midiRangeNotes[0])
  let rangeMax = getNoteAbsolute($midiRangeNotes[1])
  let rangeError = ''
  const hidden = persist(writable(false), { key: 'options-hidden' })

  let selectedKey = $keyAndScale[0]

  const scaleOptions = Array.from(scales.entries()).map(([k, v]) => ({
    key: k,
    value: v.name
  }))
  let selectedScale = $keyAndScale[1]
  $: selectedScaleNotes =
    Array.from(scales.entries()).find(([k, v]) => v.name === selectedScale)?.[1].intervals || []

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
      const old = $midiRangeNotes
      const range = [
        rang === 'min' ? parsed.data : old[0].midi,
        rang === 'max' ? parsed.data : old[1].midi
      ] as [number, number]
      inputsActions.setMidiRange(range)
      rangeError = ''
    } else {
      rangeError = parsed.err
      if (rang === 'min') {
        rangeMin = getNoteAbsolute($midiRangeNotes[0])
      } else {
        rangeMax = getNoteAbsolute($midiRangeNotes[1])
      }
    }
  }
  function handleKeyChange({
    currentTarget: { value }
  }: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    let val = value.charAt(0)
    if (val.length > 1) {
      val += value.charAt(1).toLowerCase() //.replaceAll('b', '♭').replaceAll('#', '♯')
    }
    scoreActions.setKey(val)
  }
  function handleKeyBlur() {
    if (selectedKey in keys.major || selectedKey in keys.minor) {
      selectedKey = selectedKey.replaceAll('b', '♭').replaceAll('#', '♯')
      scoreActions.setKey(selectedKey)
    } else {
      selectedKey = $keyAndScale[0]
    }
  }
  function handleSelectScale(key: string) {
    selectedScale = scaleOptions.find(k => key === k.key)?.value as string
    scoreActions.setScale(selectedScale)
    return false
  }
  function toggleVisibility() {
    hidden.update(h => !h)
  }
</script>

<div class={`${$$props.class || ''} options`}>
  <div class="flex flex-col h-full">
    <label class="font-bold" for="range_min">Range</label>
    <div class="my-1 flex w-full">
      <input
        class="h-[28px] w-full"
        id="range_min"
        bind:value={rangeMin}
        on:change={e => handleRangeChanged('min', e)}
      />
      <span class="mx-2 mt-1">—</span>
      <input
        class="h-[28px] w-full"
        id="range_max"
        bind:value={rangeMax}
        on:change={e => handleRangeChanged('max', e)}
      />
    </div>
    <div class="flex justify-between h-[20px] my-1">
      {#if rangeError}
        <div class="error">{rangeError}</div>
      {/if}
      &nbsp;
      <!-- <button class="btn-sm primary" on:click={handleSetRange}>Set left</button>
      <button class="btn-sm primary" on:click={handleSetRange}>Set right</button> -->
    </div>
  </div>
  <div class="flex flex-col h-full">
    <label class="font-bold" for="scales">Scale</label>
    <div class="my-1 w-full">
      <MultiSelectDropdown
        id="scales"
        class="p-1"
        options={scaleOptions}
        onSelect={handleSelectScale}
      >
        <div slot="value">{selectedScale}</div>
      </MultiSelectDropdown>
    </div>
    {#if !$currentGame}
      <div class="intervals my-1">
        {#each selectedScaleNotes as interval}
          <span>{interval.str}</span>
        {/each}
      </div>
    {/if}
  </div>
  <div class="flex flex-col h-full">
    <label class="font-bold" for="key">Key</label>
    <div class="my-1 flex">
      <input
        class="h-[28px]"
        id="key"
        bind:value={selectedKey}
        on:input={handleKeyChange}
        on:blur={handleKeyBlur}
      />
    </div>
    {#if !$currentGame}
      <div class="intervals my-1">
        {#each $scaleData.scaleNotes as note}
          <span>{note.note}</span>
        {/each}
      </div>
    {/if}
  </div>
  <div></div>
</div>

<style lang="scss">
  .collapsed {
    @apply py-0.5;
  }
  .options {
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
  .intervals {
    & > span + span::before {
      content: '-';
      @apply mx-[1px];
    }
  }
</style>
