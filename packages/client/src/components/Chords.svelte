<script lang="ts">
  import { writable } from 'svelte/store'
  import {
    chords,
    createChord,
    createScale,
    getRootNote,
    type MidiNote,
    type ScaleNote
  } from '@/chords-and-scales'

  import { inputsActions } from '$stores/inputs'
  import { persist } from '$stores/persist'

  $: chordsList = Array.from(chords.entries())
  $: leftList = chordsList.filter((_, i) => i < chordsList.length / 2)
  $: rightList = chordsList.filter((_, i) => i >= chordsList.length / 2)

  let selectedKey = 'C'
  let selectedScale = 'Major'
  let scale = createScale(selectedKey, selectedScale)
  let rootNote = ''
  let scaleNote: ScaleNote | undefined
  let leftChords: MidiNote[][] = []
  let rightChords: MidiNote[][] = []

  const hidden = persist(writable(false), { key: 'chords-hidden' })

  function toggleVisibility() {
    hidden.update(h => !h)
  }
  function updateChords() {
    const midi = scaleNote && 60 + scaleNote.order
    if ('err' in scale || !midi) {
      leftChords = []
      rightChords = []
    } else {
      const scl = scale.data
      leftChords = leftList.map(s => createChord(midi, scl, s[1].intervals))
      rightChords = rightList.map(s => createChord(midi, scl, s[1].intervals))
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
</script>

<div class={`${$$props.class || ''}`}>
  <fieldset class="flex flex-col rounded border-2 px-4 py-2 my-4 text-sm" class:collapsed={$hidden}>
    <legend class="text-0A text-base">
      <button class="px-1 rounded hover:bg-gray-100" on:click={toggleVisibility}>Chords</button>
    </legend>
    <div class="body" class:hidden={$hidden}>
      <div class="flex w-1/2 mb-2 input">
        <label class="mr-4 font-bold" for="scale-key">Key</label>
        <input
          class="bg-gray-100 w-16 px-1 rounded"
          id="scale-key"
          value={selectedKey}
          on:input={handleKeyChange}
          on:focus={() => inputsActions.setKeyboardFocus(false)}
          on:blur={() => inputsActions.setKeyboardFocus(true)}
        />
        <label class="mx-4 font-bold" for="scale-key">Scale</label>
        <input class="bg-gray-100 w-16 px-1 rounded" id="scale-key" value={'Major'} disabled />
        <label class="mx-4 font-bold" for="scale-key">Note</label>
        <input
          class="bg-gray-100 w-16 px-1 rounded"
          id="scale-key"
          value={rootNote}
          on:input={handleNoteChange}
          on:focus={() => inputsActions.setKeyboardFocus(false)}
          on:blur={() => inputsActions.setKeyboardFocus(true)}
        />
      </div>
      <ul class="chord-list w-full">
        {#each leftList as chord, idx}
          <div class="flex items-center justify-center px-1 bg-gray-200">{chord[0]}</div>
          <div class="intervals" title={chord[1].intervals.map(i => i.str).join('-')}>
            {#if leftChords[idx] && leftChords[idx].length > 0}
              {#each leftChords[idx] as scaleNote}
                <span>{scaleNote.note}</span>
              {/each}
            {:else}
              {#each chord[1].intervals as interval}
                <span>{interval.str}</span>
              {/each}
            {/if}
          </div>
          <div class="text-xs">{chord[1].name}</div>
        {/each}
      </ul>
      <ul class="chord-list w-full">
        {#each rightList as chord, idx}
          <div class="flex items-center justify-center px-1 bg-gray-200">{chord[0]}</div>
          <div class="intervals" title={chord[1].intervals.map(i => i.str).join('-')}>
            {#if rightChords[idx] && rightChords[idx].length > 0}
              {#each rightChords[idx] as scaleNote}
                <span>{scaleNote.note}</span>
              {/each}
            {:else}
              {#each chord[1].intervals as interval}
                <span>{interval.str}</span>
              {/each}
            {/if}
          </div>
          <div class="text-xs">{chord[1].name}</div>
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
    @media (width > 600px) {
      grid-column-end: span 2;
    }
  }
  .chord-list {
    display: grid;
    gap: 0.25rem;
    grid-template-columns: 1fr 4fr 5fr;
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
