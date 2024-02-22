<script lang="ts">
  import { writable } from 'svelte/store'
  import { getNoteAbsolute, parseNote, scalesFromJSON } from '@/chords-and-scales'

  import { currentGame } from '$stores/game'
  import { inputsActions, midiRangeNotes } from '$stores/inputs'
  import { persist } from '$stores/persist'
  import { keyAndScale, scaleData, scoreActions } from '$stores/score'

  import MultiSelectDropdown from '$elements/MultiSelectDropdown.svelte'

  let rangeMin = getNoteAbsolute($midiRangeNotes[0])
  let rangeMax = getNoteAbsolute($midiRangeNotes[1])
  let rangeError = ''
  const hidden = persist(writable(false), { key: 'options-hidden' })

  let selectedKey = $keyAndScale[0]
  let selectedScale = $keyAndScale[1]

  const scales = scalesFromJSON()
  const scaleOptions = scales.map(scl => ({
    key: scl.names[0],
    value: scl.names[0]
  }))
  $: selectedScaleNotes = scales.find(scl => scl.names[0] === selectedScale)?.intervals || []

  midiRangeNotes.subscribe(rng => {
    rangeMin = getNoteAbsolute(rng[0])
    rangeMax = getNoteAbsolute(rng[1])
  })

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
    const parsed = parseNote(e.currentTarget.value, true, true)
    if ('data' in parsed) {
      const { midi } = parsed.data
      const old = $midiRangeNotes
      const range: [number, number] = [
        rang === 'min' ? midi : old[0].midi,
        rang === 'max' ? midi : old[1].midi
      ]
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
  function rangeFocus() {
    rangeError = ''
    inputsActions.setKeyboardFocus(false)
  }
  function handleKeyChange({
    currentTarget: { value }
  }: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    selectedKey = `${value.charAt(0).toUpperCase()}${value.charAt(1).toLowerCase()}`
    scoreActions.setKey(selectedKey)
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
        on:focus={rangeFocus}
        on:blur={() => inputsActions.setKeyboardFocus(true)}
      />
      <span class="mx-2 mt-1">—</span>
      <input
        class="h-[28px] w-full"
        id="range_max"
        bind:value={rangeMax}
        on:change={e => handleRangeChanged('max', e)}
        on:focus={rangeFocus}
        on:blur={() => inputsActions.setKeyboardFocus(true)}
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
          <span>{interval.interval}</span>
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
        on:focus={() => inputsActions.setKeyboardFocus(false)}
        on:blur={() => inputsActions.setKeyboardFocus(true)}
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
  <div class="h-full flex flex-col justify-between">
    <button class="w-full btn hover:bg-gray-200">Reset</button>
    <div></div>
  </div>
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
