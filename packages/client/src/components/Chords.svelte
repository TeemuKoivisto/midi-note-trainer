<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import circle from '@iconify-icons/mdi/circle'
  import circleOut from '@iconify-icons/mdi/circle-outline'
  import select from '@iconify-icons/mdi/select'
  import selectOff from '@iconify-icons/mdi/select-off'
  import restore from '@iconify-icons/mdi/restore'
  import alphaB from '@iconify-icons/mdi/alpha-b'
  import num7 from '@iconify-icons/mdi/numeric-7-circle'

  import SearchDropdown from '$elements/SearchDropdown.svelte'

  import { writable } from 'svelte/store'
  import {
    createChord,
    createScale,
    getRootNote,
    scalesFromJSON,
    type MidiNote,
    type ScaleNote
  } from '@/chords-and-scales'

  import { gameActions, selectedChords, type SelectedChord } from '$stores/game'
  import { persist } from '$stores/persist'

  $: chords = $selectedChords
  $: leftList = chords.filter((_, i) => i < chords.length / 2)
  $: rightList = chords.filter((_, i) => i >= chords.length / 2)
  $: allSelected = chords.every(c => c.selected)

  let selectedKey = 'C'
  let selectedScale = 'Major'
  let scale = createScale(selectedKey, selectedScale)
  let rootNote = ''
  let scaleNote: ScaleNote | undefined
  let leftChords: MidiNote[][] = []
  let rightChords: MidiNote[][] = []

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
  function handleSelectScale(key: string | number) {
    selectedScale = scaleOptions.find(k => key === k.key)?.value as string
    scale = createScale(selectedKey, selectedScale)
    updateChords()
    return false
  }
</script>

<div class={`${$$props.class || ''}`}>
  <fieldset
    class="flex flex-col relative rounded border-2 px-4 pt-2 pb-4 my-4 text-sm"
    class:collapsed={$hidden}
  >
    <legend class="text-base">
      <button class="px-1 rounded hover:bg-gray-100" on:click={toggleVisibility}>Chords</button>
    </legend>
    <div class="absolute top-[-0.25rem] right-[0.5rem] flex">
      <button
        class="flex items-center justify-center rounded px-0.5 hover:bg-gray-200"
        class:hidden={$hidden}
        on:click={handleSelectBasicChords}
      >
        <Icon icon={alphaB} width={20} />
      </button>
      <button
        class="flex items-center justify-center rounded px-1 py-1 hover:bg-gray-200"
        class:hidden={$hidden}
        on:click={handleSelect7Chords}
      >
        <Icon icon={num7} width={16} />
      </button>
      <button
        class="flex items-center justify-center rounded px-1 py-1 hover:bg-gray-200"
        class:hidden={$hidden}
        on:click={handleSelectAll}
      >
        <Icon icon={allSelected ? selectOff : select} width={16} />
      </button>
      <button
        class="flex items-center justify-center rounded px-1 py-1 hover:bg-gray-200"
        class:hidden={$hidden}
        on:click={reset}
      >
        <Icon icon={restore} width={16} />
      </button>
    </div>
    <div class="body" class:hidden={$hidden}>
      <div class="flex mb-2 input">
        <label class="mr-4 font-bold" for="scale-key">Key</label>
        <input
          class="bg-gray-100 w-12 px-1 rounded"
          id="scale-key"
          value={selectedKey}
          on:input={handleKeyChange}
        />
        <label class="font-bold" for="scale-key">Scale</label>
        <SearchDropdown
          class="bg-gray-100 w-[12rem] mr-4"
          selected={selectedScale}
          options={scaleOptions}
          onSelect={handleSelectScale}
        />
        <label class="font-bold" for="scale-key">Note</label>
        <input
          class="bg-gray-100 w-12 px-1 rounded"
          id="scale-key"
          value={rootNote}
          on:input={handleNoteChange}
        />
      </div>
      <ul class="chord-list w-full">
        {#each leftList as chord, idx}
          <li>
            <button
              class="flex items-center justify-center w-full select-btn"
              class:hidden={$hidden}
              on:click={() => handleSelectChord(chord)}
            >
              <span
                class="px-1 py-1 rounded"
                class:text-green-500={chord.selected}
                class:text-gray-400={!chord.selected}
              >
                <Icon icon={chord.selected ? circle : circleOut} width={12} />
              </span>
              <div class="ml-1 px-1 w-full bg-gray-200">{chord.suffixes[0]}</div>
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
          <li class="text-xs">{chord.name}</li>
        {/each}
      </ul>
      <ul class="chord-list w-full">
        {#each rightList as chord, idx}
          <li>
            <button
              class="flex items-center justify-center w-full select-btn"
              class:hidden={$hidden}
              on:click={() => handleSelectChord(chord)}
            >
              <span
                class="px-1 py-1 rounded"
                class:text-green-500={chord.selected}
                class:text-gray-400={!chord.selected}
              >
                <Icon icon={chord.selected ? circle : circleOut} width={12} />
              </span>
              <div class="ml-1 px-1 w-full bg-gray-200">{chord.suffixes[0]}</div>
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
          <li class="text-xs">{chord.name}</li>
        {/each}
      </ul>
    </div>
  </fieldset>
</div>

<style lang="scss">
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
  .input {
    display: grid;
    grid-template-columns: 1fr 3fr;
    & > input {
      @apply my-1 mr-0;
    }
    @media (width > 600px) {
      grid-column-end: span 2;
      @apply flex;
      & > label {
        @apply my-0 mr-4;
      }
      & > input {
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
      @apply text-xs mx-[1px];
    }
  }
  .error {
    @apply text-xs text-red-500;
  }
</style>
