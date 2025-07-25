<script lang="ts">
  import { writable } from 'svelte/store'
  import {
    createChord,
    createScale,
    createScaleUnsafe,
    createTrichords,
    normalizeKey,
    scalesFromJSON
  } from '@/chords-and-scales'

  import Intervals from './Intervals.svelte'
  import Trichords from './Trichords.svelte'

  import { scoreActions, scaleData } from '$stores/score'
  import { inputsActions, midiRangeNotes } from '$stores/inputs'
  import { persist } from '$stores/persist'

  import type { MidiNote, RawScale, Scale, ScaleNote, ScaleTrichord } from '@/chords-and-scales'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLDivElement> {}

  let { ...rest }: Props = $props()

  interface ListItem {
    key: string
    raw: RawScale
    scale: Scale
    trichords: ScaleTrichord[]
    chords: string[]
  }

  const scales = $derived(scalesFromJSON())
  let scalesList = $state<ListItem[]>(
    scales.map(scl => ({
      key: scl.names[0],
      raw: scl,
      scale: createScaleUnsafe($scaleData.key, scl.names[0]),
      trichords: scl.trichords,
      chords: []
    }))
  )
  type Lists = {
    where: string
    leftList: ListItem[]
    rightList: ListItem[]
  }
  let { leftList, rightList } = $derived(
    scalesList.reduce<Lists>(
      (acc, v) => {
        if (v.key === 'Minor') {
          acc.where = v.key
        } else if (v.key === 'Ionian') {
          acc.where = 'rest'
        }
        if (acc.where === 'Major') {
          acc.leftList.push(v)
        } else if (acc.where === 'Minor') {
          acc.rightList.push(v)
        } else if (acc.rightList.length < acc.leftList.length) {
          acc.rightList.push(v)
        } else {
          acc.leftList.push(v)
        }
        return acc
      },
      { where: 'Major', leftList: [], rightList: [] }
    )
  )
  let shownKey = $state('')
  let oldKeyAndScale = $state([$scaleData.key, $scaleData.scale])
  let playingNotesTimeout = $state<ReturnType<typeof setTimeout> | undefined>()

  const hidden = persist(writable(true), { key: 'scales-hidden' })

  function toggleVisibility() {
    hidden.update(h => !h)
  }
  function handleKeyChange({
    currentTarget: { value }
  }: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    shownKey = normalizeKey(value)
    scalesList = scalesList.map(d => {
      const created = createScale(shownKey, d.key)
      let scl = shownKey && 'data' in created ? created.data : undefined
      let chords: string[] = []
      if (scl) {
        chords = d.trichords.map(
          (t, idx) =>
            `${scl!.scaleNotes[idx].note}${!t.suffix.includes('°') && t.minor ? 'm' : ''}${
              t.suffix
            }`
        )
      } else {
        scl = createScaleUnsafe($scaleData.key, d.key)
      }
      return { ...d, scale: scl, chords }
    })
  }
  function playNote(index: number, notes: MidiNote[][], timeout: number) {
    if (index < notes.length) {
      const midi = notes[index++]
      scoreActions.setPlayed(midi)
      inputsActions.play(midi.map(m => m.midi))
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
  function handleTrichordsClicked(item: ListItem) {
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
    const chords = createTrichords(item.trichords)
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

<div {...rest} class={`${rest.class || ''}`}>
  <fieldset
    class="my-4 flex flex-col rounded border-2 px-4 pb-4 pt-2 text-sm"
    class:collapsed={$hidden}
  >
    <legend class="flex w-fit text-base">
      <button class="z-0 rounded px-1 hover:bg-gray-100" onclick={toggleVisibility}>Scales</button>
    </legend>
    <div class="input mb-2 flex" class:hidden={$hidden}>
      <label class="mr-4 font-bold" for="scale-key">Key</label>
      <input
        class="w-16 rounded bg-gray-100 px-1"
        id="scale-key"
        value={shownKey}
        oninput={handleKeyChange}
      />
    </div>
    <div class="body max-h-[30rem] overflow-scroll" class:hidden={$hidden}>
      <ul class="list split-list odd w-full">
        {#each leftList as scale}
          <li>
            <div class="text-xs font-bold">{scale.raw.names[0]}</div>
            <Intervals
              scale={scale.scale}
              intervals={scale.raw.intervals}
              onClick={() => handleIntervalsClicked(scale)}
            />
            <Trichords
              trichords={scale.trichords}
              chords={scale.chords}
              onClick={() => handleTrichordsClicked(scale)}
            />
          </li>
        {/each}
      </ul>
      <ul class="list split-list even w-full">
        {#each rightList as scale}
          <li>
            <div class="text-xs font-bold">{scale.raw.names[0]}</div>
            <Intervals
              scale={scale.scale}
              intervals={scale.raw.intervals}
              onClick={() => handleIntervalsClicked(scale)}
            />
            <Trichords
              trichords={scale.trichords}
              chords={scale.chords}
              onClick={() => handleTrichordsClicked(scale)}
            />
          </li>
        {/each}
      </ul>
      <ul class="list full-list odd w-full">
        {#each scalesList as scale}
          <li>
            <div class="text-xs font-bold">{scale.raw.names[0]}</div>
            <Intervals
              scale={scale.scale}
              intervals={scale.raw.intervals}
              onClick={() => handleIntervalsClicked(scale)}
            />
            <Trichords
              trichords={scale.trichords}
              chords={scale.chords}
              onClick={() => handleTrichordsClicked(scale)}
            />
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
      & > .split-list {
        display: none;
      }
      & > .full-list {
        display: flex;
      }
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
  .full-list {
    display: none;
  }
  .error {
    @apply text-xs text-red-500;
  }
</style>
