<script lang="ts">
  import { writable } from 'svelte/store'
  import { createChord, createScale, createTriadChords, scalesFromJSON } from '@/chords-and-scales'

  import Intervals from './Intervals.svelte'
  import Triads from './Triads.svelte'

  import { scoreActions, scaleData } from '$stores/score'
  import { inputs, midiRangeNotes, piano } from '$stores/inputs'
  import { persist } from '$stores/persist'

  import type { MidiNote, RawScale, Scale, ScaleNote, ScaleTriad } from '@/chords-and-scales'

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
  let oldKeyAndScale = [$scaleData.key, $scaleData.scale]
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
  function playNote(index: number, notes: MidiNote[][], timeout: number) {
    if (index < notes.length) {
      const midi = notes[index++]
      scoreActions.setPlayed(midi)
      $piano?.playChord(
        midi.map(m => m.midi),
        $inputs.fixedVelocity
      )
      playingNotesTimeout = setTimeout(() => playNote(index, notes, timeout), timeout)
    } else {
      scoreActions.setPlayed([])
      scoreActions.setKeyAndScale(oldKeyAndScale[0], oldKeyAndScale[1])
    }
  }
  function handleIntervalsClicked(item: ListItem) {
    clearTimeout(playingNotesTimeout)
    let notes: MidiNote[][]
    let scale: Scale
    if (item.scale) {
      scale = item.scale
      oldKeyAndScale = [$scaleData.key, $scaleData.scale]
      scoreActions.setKeyAndScale(item.scale.key, item.scale.scale)
    } else {
      scale = $scaleData
    }
    const startingNote = $midiRangeNotes[0].midi + scale.scaleNotes[0].semitones
    notes = item.raw.intervals.map(int => {
      const note = scale.notesMap.get(int.semitones % 12) as ScaleNote
      return [{ ...note, midi: startingNote + int.semitones }]
    })
    // Add tonic as final note (UNLESS there is one already) since it sounds nicer
    if (notes[0][0].semitones !== notes[notes.length - 1][0].semitones) {
      notes.push(notes[0].map(n => ({ ...n, midi: n.midi + 12 })))
    }
    playNote(0, notes, 500)
  }
  function handleTriadsClicked(item: ListItem) {
    clearTimeout(playingNotesTimeout)
    const { intervals } = item.raw
    let notes: MidiNote[][]
    let scale: Scale
    if (item.scale) {
      scale = item.scale
      oldKeyAndScale = [$scaleData.key, $scaleData.scale]
      scoreActions.setKeyAndScale(item.scale.key, item.scale.scale)
    } else {
      scale = $scaleData
    }
    const startingNote = $midiRangeNotes[0].midi + scale.scaleNotes[0].semitones
    const chords = createTriadChords(item.triads)
    notes = chords.map((c, idx) =>
      createChord(startingNote + scale.intervals[idx].semitones, scale, c.intervals)
    )
    // Add tonic as final note (UNLESS there is one already) since it sounds nicer
    if (intervals[intervals.length - 1].interval_seq !== 1) {
      notes.push(notes[0].map(n => ({ ...n, midi: n.midi + 12 })))
    }
    playNote(0, notes, 750)
  }
</script>

<div class={`${$$props.class || ''}`}>
  <fieldset
    class="flex flex-col rounded border-2 px-4 pt-2 pb-4 my-4 text-sm"
    class:collapsed={$hidden}
  >
    <legend class="text-base">
      <button class="px-1 rounded hover:bg-gray-100" on:click={toggleVisibility}>Scales</button>
    </legend>
    <div class="flex mb-2 input" class:hidden={$hidden}>
      <label class="mr-4 font-bold" for="scale-key">Key</label>
      <input
        class="bg-gray-100 w-16 px-1 rounded"
        id="scale-key"
        value={shownKey}
        on:input={handleKeyChange}
      />
    </div>
    <div class="body max-h-[30rem] overflow-scroll" class:hidden={$hidden}>
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
