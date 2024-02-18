<script lang="ts">
  import { writable } from 'svelte/store'
  import { createScale, createTriadChords, scalesFromJSON } from '@/chords-and-scales'

  import Intervals from './Intervals.svelte'
  import Triads from './Triads.svelte'

  import { scoreActions, scaleData } from '$stores/score'
  import { inputsActions, inputs, midiRangeNotes, piano } from '$stores/inputs'
  import { persist } from '$stores/persist'

  import type { Interval, RawScale, Scale, ScaleTriad } from '@/chords-and-scales'

  interface ListItem {
    key: string
    raw: RawScale
    scale: Scale | undefined
    triads: ScaleTriad[]
    triadChords: string[]
  }

  const scales = scalesFromJSON()
  let scalesList: ListItem[] = scales.map(scl => ({
    key: scl.names[0],
    raw: scl,
    scale: undefined,
    triads: scl.triads,
    triadChords: []
  }))
  $: leftList = scalesList.filter((_, i) => i < scalesList.length / 2)
  $: rightList = scalesList.filter((_, i) => i >= scalesList.length / 2)

  let shownKey = ''
  let playingNotesTimeout: ReturnType<typeof setTimeout> | undefined

  const hidden = persist(writable(true), { key: 'scales-hidden' })

  function toggleVisibility() {
    hidden.update(h => !h)
  }
  function handleKeyChange({
    currentTarget: { value }
  }: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    shownKey = `${value.charAt(0).toUpperCase()}${value.charAt(1).toLowerCase()}`
    scalesList = scalesList.map(d => {
      const created = createScale(shownKey, d.key)
      const data = shownKey && 'data' in created ? created.data : undefined
      let chords: string[] = []
      if (data) {
        chords = d.triads.map(
          (t, idx) =>
            `${data.scaleNotes[idx].note}${!t.suffix.includes('°') && t.minor ? 'm' : ''}${
              t.suffix
            }`
        )
      }
      return { ...d, scale: data, triadChords: chords }
    })
  }
  function playNote(index: number, notes: number[][], timeout: number) {
    if (index < notes.length) {
      notes[index++].forEach(midi => {
        scoreActions.pushPlayed(midi)
        $piano?.noteOn(midi, $inputs.fixedVelocity)
      })
      playingNotesTimeout = setTimeout(() => playNote(index, notes, timeout), timeout)
    }
  }
  function handleIntervalsClicked(item: ListItem) {
    clearTimeout(playingNotesTimeout)
    const lowNote = $midiRangeNotes[0]
    let notes: number[][]
    if (item.scale) {
      const startNote = item.scale.scaleNotes[0]
      notes = item.scale.intervals.map(int => [lowNote.midi + startNote.semitones + int.semitones])
    } else {
      notes = item.raw.intervals.map(int => [lowNote.midi + int.semitones])
    }
    playNote(0, notes, 500)
  }
  function handleTriadsClicked(item: ListItem) {
    console.log(item)
    clearTimeout(playingNotesTimeout)
    const lowNote = $midiRangeNotes[0]
    let notes: number[][]
    if (item.triadChords.length > 0) {
      notes = []
    } else {
      // const scale = $scaleData
      const chords = createTriadChords(item.triads)
      notes = chords.map(c => c.intervals.map(int => lowNote.midi + int.semitones))
    }
    playNote(0, notes, 750)
  }
</script>

<div class={`${$$props.class || ''}`}>
  <fieldset class="flex flex-col rounded border-2 px-4 py-2 my-4 text-sm" class:collapsed={$hidden}>
    <legend class="text-base">
      <button class="px-1 rounded hover:bg-gray-100" on:click={toggleVisibility}>Scales</button>
    </legend>
    <div class="body" class:hidden={$hidden}>
      <div class="flex w-1/2 mb-2 input">
        <label class="mr-4 font-bold" for="scale-key">Key</label>
        <input
          class="bg-gray-100 w-16 px-1 rounded"
          id="scale-key"
          value={shownKey}
          on:input={handleKeyChange}
          on:focus={() => inputsActions.setKeyboardFocus(false)}
          on:blur={() => inputsActions.setKeyboardFocus(true)}
        />
      </div>
      <ul class="list odd w-full">
        {#each leftList as scale}
          <li>
            <div class="text-xs font-bold">{scale.raw.names[0]}</div>
            <Intervals
              scale={scale.scale}
              intervals={scale.raw.intervals}
              on:click={() => handleIntervalsClicked(scale)}
            />
            <Triads
              triads={scale.triads}
              chords={scale.triadChords}
              on:click={() => handleTriadsClicked(scale)}
            />
          </li>
        {/each}
      </ul>
      <ul class="list even w-full">
        {#each rightList as scale}
          <li>
            <div class="text-xs font-bold">{scale.raw.names[0]}</div>
            <Intervals
              scale={scale.scale}
              intervals={scale.raw.intervals}
              on:click={() => handleIntervalsClicked(scale)}
            />
            <Triads
              triads={scale.triads}
              chords={scale.triadChords}
              on:click={() => handleTriadsClicked(scale)}
            />
          </li>
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
  .list {
    @apply flex flex-col gap-1;
    & > li {
      display: grid;
      grid-template-columns: auto;
      grid-template-rows: auto;
      align-items: center;
      @apply rounded p-1;
      & > :global(.intervals) {
        @apply mt-0.5;
      }
    }
    &.even {
      & > li:nth-child(even) {
        @apply bg-gray-100;
      }
    }
    &.odd {
      & > li:nth-child(odd) {
        @apply bg-gray-100;
      }
    }
  }
  .error {
    @apply text-xs text-red-500;
  }
</style>
