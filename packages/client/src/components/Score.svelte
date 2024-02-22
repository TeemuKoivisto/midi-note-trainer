<script lang="ts">
  import { onMount } from 'svelte'
  import { derived } from 'svelte/store'
  import Vex from 'vexflow'
  import { FLAT_NOTES, SHARP_NOTES } from '@/chords-and-scales'

  import ReplayButton from './ReplayButton.svelte'

  import { currentGame, guessState, type GuessState, type GameInstance } from '$stores/game'
  import { played, target, scaleData, type PlayedNote } from '$stores/score'
  import { getOctave } from '$utils/getNote'

  import type { MidiNote, Scale } from '@/chords-and-scales'
  import type { Note } from '@/types'

  interface Data {
    game: GameInstance | undefined
    guessed: GuessState
    scale: Scale
    target: MidiNote[]
    played: PlayedNote[]
  }

  const { Accidental, Formatter, Renderer, Stave, StaveNote } = Vex.Flow

  let outputEl: HTMLDivElement
  let renderer: Vex.Renderer
  let ctx: Vex.RenderContext
  let tickContext: Vex.TickContext

  const data = derived(
    [currentGame, guessState, scaleData, played, target],
    ([c, g, sc, p, t]) => ({
      game: c,
      guessed: g,
      scale: sc,
      played: p,
      target: t
    })
  )

  onMount(() => {
    init()
    data.subscribe(d => updateNotes(d))
  })

  function addParts(note: MidiNote, scale: Scale): Note {
    const flats = FLAT_NOTES.slice(0, scale.flats).find(n => n === note.note.slice(0, 2))
      ? note.flats - 1
      : note.flats
    const sharps = SHARP_NOTES.slice(0, scale.sharps).find(n => n === note.note.slice(0, 2))
      ? note.sharps - 1
      : note.sharps
    return {
      ...note,
      parts: [
        note.note.charAt(0),
        `${'b'.repeat(flats)}${'#'.repeat(sharps)}`,
        getOctave(note.midi)
      ]
    }
  }

  function init() {
    renderer = new Renderer(outputEl, Renderer.Backends.SVG)
    renderer.resize(732, 360)
    ctx = renderer.getContext()
    ctx.scale(2.0, 2.0)
    // console.log('ctx', ctx)
    tickContext = new Vex.Flow.TickContext()
    const tclef = new Stave(0, 0, 200).addClef('treble').addKeySignature('B')
    const bclef = new Stave(0, 60, 200).addClef('bass').addKeySignature('B')
    const trebleNotes = [
      new StaveNote({ keys: ['g#/4'], duration: 'q' }),
      new StaveNote({ keys: ['b/4'], duration: 'qr' }),
      new StaveNote({ keys: ['c/4'], duration: 'q' }),
      new StaveNote({ keys: ['a/4', 'c/5', 'e/5'], duration: 'q' })
    ]
    const bassNotes = [
      new StaveNote({ clef: 'bass', keys: ['f/3'], duration: 'q' }),
      new StaveNote({ clef: 'bass', keys: ['b/3'], duration: 'qr' }),
      new StaveNote({ clef: 'bass', keys: ['b/2'], duration: 'q' }),
      new StaveNote({ clef: 'bass', keys: ['c/3', 'e/3', 'g/3'], duration: 'q' })
    ]
    trebleNotes[0].addModifier(new Accidental('#'), 0)
    const v1 = new Vex.Flow.Voice({ num_beats: 4, beat_value: 4 }).addTickables(trebleNotes)
    const v2 = new Vex.Flow.Voice({ num_beats: 4, beat_value: 4 }).addTickables(bassNotes)
    // Make sure the staves have the same starting point for notes
    const startX = Math.max(tclef.getNoteStartX(), bclef.getNoteStartX())
    tclef.setNoteStartX(startX)
    bclef.setNoteStartX(startX)
    const formatter = new Vex.Flow.Formatter()
    formatter.joinVoices([v1])
    formatter.joinVoices([v2])
    formatter.format([v1, v2], 190 - startX)
    // formatter.joinVoices([voice]).formatToStave([voice], s1)
    // const formatter1 = new Vex.Flow.Formatter()
    //   .joinVoices([v1])
    //   .formatToStave([v1], tclef, { align_rests: true })
    //   .joinVoices([v2])
    //   .formatToStave([v2], bclef, { align_rests: true })
    v1.draw(ctx, tclef)
    v2.draw(ctx, bclef)
    tclef.setContext(ctx).draw()
    bclef.setContext(ctx).draw()
  }

  function notesToVexflowNotes(notes: (MidiNote | PlayedNote)[], scale: Scale) {
    const bassNotes = []
    const trebleNotes = []
    for (let i = 0; i < notes.length; i += 1) {
      const n = notes[i]
      const octave = getOctave(n.midi)
      const color =
        'color' in n && n.color !== 'default'
          ? n.color === 'correct'
            ? 'rgb(34, 197, 94)'
            : 'red'
          : undefined
      const note = { ...addParts(notes[i], scale), color }
      if (octave < 4) {
        bassNotes.push(note)
      } else {
        trebleNotes.push(note)
      }
    }
    const snotes: Vex.StaveNote[] = []
    if (bassNotes.length > 0) {
      const bassNote = new Vex.Flow.StaveNote({
        clef: 'bass',
        keys: bassNotes.map(n => `${n.parts[0]}${n.parts[1]}/${n.parts[2]}`),
        duration: 'w'
      }).setAttribute('clef', 'bass')
      bassNotes.forEach((n, idx) => {
        if (n.parts[1]) {
          bassNote.addModifier(new Accidental(n.parts[1]), idx)
        }
        // @TODO should set these individually to notes
        if (n.color) {
          bassNote.setStyle({ fillStyle: n.color })
        }
      })
      snotes.push(bassNote)
    }
    if (trebleNotes.length > 0) {
      const trebleNote = new Vex.Flow.StaveNote({
        clef: 'treble',
        keys: trebleNotes.map(n => `${n.parts[0]}${n.parts[1]}/${n.parts[2]}`),
        duration: 'w'
      }).setAttribute('clef', 'treble')
      trebleNotes.forEach((n, idx) => {
        if (n.parts[1]) {
          trebleNote.addModifier(new Accidental(n.parts[1]), idx)
        }
        if (n.color) {
          trebleNote.setStyle({ fillStyle: n.color })
        }
      })
      snotes.push(trebleNote)
    }
    return snotes
  }

  function updateNotes({ game, guessed, scale, played, target }: Data) {
    // console.log('hello notes', notes)
    const key = scale.majorSignature.replaceAll('♭', 'b').replaceAll('♯', '#')
    ctx.clear()
    ctx.scale(0.5, 0.5)
    const bclef = new Stave(0, 60, 200).addClef('bass').addKeySignature(key)
    const tclef = new Stave(0, 0, 200).addClef('treble').addKeySignature(key)
    const staveNotes = [
      ...notesToVexflowNotes(target, scale),
      ...notesToVexflowNotes(played, scale)
    ]
    const bassNotes = staveNotes.filter(n => n.getAttribute('clef') === 'bass')
    const trebleNotes = staveNotes.filter(n => n.getAttribute('clef') === 'treble')
    const voices = []
    if (trebleNotes.length > 0) {
      voices.push(
        new Vex.Flow.Voice({ num_beats: 4, beat_value: 4 }).setMode(2).addTickables(trebleNotes)
      )
    }
    if (bassNotes.length > 0) {
      voices.push(
        new Vex.Flow.Voice({ num_beats: 4, beat_value: 4 }).setMode(2).addTickables(bassNotes)
      )
    }
    const startX = Math.max(tclef.getNoteStartX(), bclef.getNoteStartX())
    tclef.setNoteStartX(startX)
    bclef.setNoteStartX(startX)
    const formatter = new Vex.Flow.Formatter()
    // The treble and bass are joined independently but formatted together
    voices.forEach(v => {
      formatter.joinVoices([v])
    })
    if (voices.length > 0) {
      formatter.format(voices, 190 - startX)
    }
    if (trebleNotes.length > 0) {
      voices[0].draw(ctx, tclef)
    }
    if (bassNotes.length > 0) {
      voices[voices.length - 1].draw(ctx, bclef)
    }
    tclef.setContext(ctx).draw()
    bclef.setContext(ctx).draw()
  }
</script>

<section class={`${$$props.class || ''}`}>
  <div class="relative" id="output" bind:this={outputEl}>
    <ReplayButton />
  </div>
</section>

<style lang="scss">
  :global(.hidden) {
    display: none;
  }
  :global(.vf-stave path) {
    stroke: #000;
  }
  // :global(.vf-stave path:nth-of-type(2)) {
  //   stroke: #222;
  // }
</style>
