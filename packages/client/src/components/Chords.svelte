<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import circle from '@iconify-icons/mdi/circle'
  import circleOut from '@iconify-icons/mdi/circle-outline'
  import select from '@iconify-icons/mdi/select'
  import selectOff from '@iconify-icons/mdi/select-off'
  import restore from '@iconify-icons/mdi/restore'
  import alphaB from '@iconify-icons/mdi/alpha-b'
  import num7 from '@iconify-icons/mdi/numeric-7-circle'
  import { writable } from 'svelte/store'

  import SearchDropdown from '$elements/SearchDropdown.svelte'

  import {
    createChord,
    createScale,
    getRootNote,
    scalesFromJSON,
    type MidiNote,
    type ScaleNote
  } from '@/chords-and-scales'

  import { gameActions, selectedChords, type SelectedChord } from '$stores/game'
  import { inputsActions, midiRangeNotes } from '$stores/inputs'
  import { persist } from '$stores/persist'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLElement> {}

  let props: Props = $props()
  let chords = $derived($selectedChords)
  let leftList = $derived(chords.filter((_, i) => i < chords.length / 2))
  let rightList = $derived(chords.filter((_, i) => i >= chords.length / 2))
  let allSelected = $derived(chords.every(c => c.selected))

  let selectedKey = $state('C')
  let selectedScale = $state('Major')
  let scale = $state(createScale(selectedKey, selectedScale))
  let rootNote = $state('')
  let scaleNote: ScaleNote | undefined = $state(undefined)
  let leftChords: MidiNote[][] = $state([])
  let rightChords: MidiNote[][] = $state([])

  const scales = scalesFromJSON()
  const scaleOptions = scales.map(scl => ({
    key: scl.names[0],
    value: scl.names[0]
  }))

  const hidden = persist(writable(true), { key: 'chords-hidden' })

  function toggleVisibility() {
    hidden.update(h => !h)
  }
  function updateChords() {
    const midi = scaleNote && 60 + scaleNote.semitones
    if ('err' in scale || !midi) {
      leftChords = []
      rightChords = []
    } else {
      const scl = scale.data
      leftChords = leftList.map(s => createChord(midi, scl, s.intervals))
      rightChords = rightList.map(s => createChord(midi, scl, s.intervals))
    }
  }
  function handleKeyChange({
    currentTarget: { value }
  }: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    selectedKey = `${value.charAt(0).toUpperCase()}${value.charAt(1).toLowerCase()}`
    scale = createScale(selectedKey, selectedScale)
    updateChords()
  }
  function handleSelectScale(key: string | number) {
    selectedScale = scaleOptions.find(k => key === k.key)?.value as string
    scale = createScale(selectedKey, selectedScale)
    updateChords()
    return false
  }
  function handleNoteChange({
    currentTarget: { value }
  }: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    rootNote = `${value.charAt(0).toUpperCase()}${value.charAt(1).toLowerCase()}`
    scaleNote = getRootNote(rootNote)
    updateChords()
  }
  function handleSelectChord(chord: SelectedChord) {
    gameActions.toggleChords(c => (c.name === chord.name ? !c.selected : c.selected))
  }
  function handleSelectBasicChords() {
    const isMajMinor = (c: SelectedChord) => c.suffixes[0] === 'maj' || c.suffixes[0] === 'm'
    const everySelected = $selectedChords.filter(isMajMinor).every(c => c.selected)
    gameActions.toggleChords(c => (isMajMinor(c) ? (everySelected ? false : true) : c.selected))
  }
  function handleSelect7Chords() {
    const is7 = (c: SelectedChord) =>
      c.suffixes[0] === 'maj7' ||
      c.suffixes[0] === 'm7' ||
      c.suffixes[0] === '7' ||
      c.suffixes[0] === 'dim7' ||
      c.suffixes[0] === 'aug7'
    const everySelected = $selectedChords.filter(is7).every(c => c.selected)
    gameActions.toggleChords(c => (is7(c) ? (everySelected ? false : true) : c.selected))
  }
  function handleSelectAll() {
    gameActions.toggleChords(_ => !allSelected)
  }
  function reset() {
    gameActions.toggleChords(_ => true)
  }
  function handlePlayChord(chord: SelectedChord) {
    if ('err' in scale) {
      return
    }
    const startingNote = $midiRangeNotes[0].midi + (scaleNote?.semitones || 0)
    const notes = createChord(startingNote, scale.data, chord.intervals)
    inputsActions.play(notes.map(n => n.midi))
  }
</script>

<div {...props} class={`${props.class || ''}`}>
  <fieldset
    class="relative my-4 flex flex-col rounded border-2 px-4 pb-4 pt-2 text-sm"
    class:collapsed={$hidden}
  >
    <legend class="flex w-fit text-base">
      <button class="z-0 rounded px-1 hover:bg-gray-100" onclick={toggleVisibility}>Chords</button>
    </legend>
    <div class="absolute right-[0.5rem] top-[-0.25rem] flex">
      <button
        class="flex items-center justify-center rounded px-0.5 hover:bg-gray-200"
        class:hidden={$hidden}
        onclick={handleSelectBasicChords}
      >
        <Icon icon={alphaB} width={20} />
      </button>
      <button
        class="flex items-center justify-center rounded px-1 py-1 hover:bg-gray-200"
        class:hidden={$hidden}
        onclick={handleSelect7Chords}
      >
        <Icon icon={num7} width={16} />
      </button>
      <button
        class="flex items-center justify-center rounded px-1 py-1 hover:bg-gray-200"
        class:hidden={$hidden}
        onclick={handleSelectAll}
      >
        <Icon icon={allSelected ? selectOff : select} width={16} />
      </button>
      <button
        class="flex items-center justify-center rounded px-1 py-1 hover:bg-gray-200"
        class:hidden={$hidden}
        onclick={reset}
      >
        <Icon icon={restore} width={16} />
      </button>
    </div>
    <div class="body" class:hidden={$hidden}>
      <div class="options mb-2 flex">
        <label class="mr-4 font-bold" for="chords-key">Key</label>
        <input
          class="input w-12 rounded bg-gray-100 px-1"
          id="chords-key"
          value={selectedKey}
          oninput={handleKeyChange}
        />
        <label class="font-bold" for="chords-scale">Scale</label>
        <SearchDropdown
          id="chords-scale"
          class="w-full bg-gray-100 pl-1"
          containerClass="input"
          selected={selectedScale}
          options={scaleOptions}
          onSelect={handleSelectScale}
        />
        <label class="font-bold" for="chords-note">Note</label>
        <input
          class="input w-12 rounded bg-gray-100 px-1"
          id="chords-note"
          value={rootNote}
          oninput={handleNoteChange}
        />
      </div>
      <ul class="chord-list w-full">
        {#each leftList as chord, idx}
          <li>
            <button
              class="select-btn flex w-full items-center justify-center"
              class:hidden={$hidden}
              onclick={() => handleSelectChord(chord)}
            >
              <span
                class="rounded px-1 py-1"
                class:text-green-500={chord.selected}
                class:text-gray-400={!chord.selected}
              >
                <Icon icon={chord.selected ? circle : circleOut} width={12} />
              </span>
              <div class="ml-1 w-full bg-gray-200 px-1">{chord.suffixes[0]}</div>
            </button>
          </li>
          <li class="intervals" title={chord.intervals.map(i => i.interval).join('-')}>
            {#if leftChords[idx] && leftChords[idx].length > 0}
              {#each leftChords[idx] as scaleNote}
                <span>{scaleNote.note}</span>
              {/each}
            {:else}
              {#each chord.intervals as interval}
                <span>{interval.interval}</span>
              {/each}
            {/if}
          </li>
          <li class="text-xs">
            <button class="text-start" onclick={() => handlePlayChord(chord)}>{chord.name}</button>
          </li>
        {/each}
      </ul>
      <ul class="chord-list w-full">
        {#each rightList as chord, idx}
          <li>
            <button
              class="select-btn flex w-full items-center justify-center"
              class:hidden={$hidden}
              onclick={() => handleSelectChord(chord)}
            >
              <span
                class="rounded px-1 py-1"
                class:text-green-500={chord.selected}
                class:text-gray-400={!chord.selected}
              >
                <Icon icon={chord.selected ? circle : circleOut} width={12} />
              </span>
              <div class="ml-1 w-full bg-gray-200 px-1">{chord.suffixes[0]}</div>
            </button>
          </li>
          <li class="intervals" title={chord.intervals.map(i => i.interval).join('-')}>
            {#if rightChords[idx] && rightChords[idx].length > 0}
              {#each rightChords[idx] as scaleNote}
                <span>{scaleNote.note}</span>
              {/each}
            {:else}
              {#each chord.intervals as interval}
                <span>{interval.interval}</span>
              {/each}
            {/if}
          </li>
          <li class="text-xs">
            <button class="text-start" onclick={() => handlePlayChord(chord)}>{chord.name}</button>
          </li>
        {/each}
      </ul>
    </div>
  </fieldset>
</div>

<style lang="postcss">
  @reference "#app.pcss";

  .collapsed {
    @apply py-0.5;
  }
  .body {
    display: grid;
    gap: 0.25rem;
    grid-template-columns: [col1] 1fr [col2] 1fr;
    grid-template-rows: auto;
    @media (width <= 600px) {
      grid-template-columns: 1fr;
    }
    &.hidden {
      display: none;
    }
  }
  .options {
    --search-dropdown-width: 13rem;
    display: grid;
    grid-template-columns: 1fr 3fr;
    & > :global(.input) {
      @apply my-0.5 mr-0;
    }
    @media (width > 600px) {
      grid-column-end: span 2;
      @apply flex;
      & > label {
        @apply my-0 mr-4;
      }
      & > :global(.input) {
        @apply my-0 mr-4;
      }
    }
  }
  .select-btn {
    &:hover {
      & > div {
        @apply bg-gray-300;
      }
    }
  }
  .chord-list {
    display: grid;
    gap: 0.25rem;
    grid-template-columns: 2fr 4fr 5fr;
    grid-template-rows: auto;
    align-items: center;
  }
  .intervals {
    & > span + span::before {
      content: '-';
      @apply mx-[1px] text-xs;
    }
  }
  .error {
    @apply text-xs text-red-500;
  }
</style>
