<script lang="ts">
  import { onMount } from 'svelte'
  import { derived } from 'svelte/store'
  import Vex from 'vexflow'
  import { getOctave, FLAT_NOTES, SHARP_NOTES } from '@/chords-and-scales'

  import ReplayButton from './ReplayButton.svelte'
  import QuitButton from './QuitButton.svelte'

  import { currentGame, guessState, type GuessState } from '$stores/game'
  import { played, target, scaleData, type PlayedNote } from '$stores/score'

  import type { MidiNote, Scale } from '@/chords-and-scales'
  import type { GameInstance } from '@/games'

  interface Data {
    game: GameInstance | undefined
    guessed: GuessState
    scale: Scale
    target: MidiNote[]
    played: PlayedNote[]
  }

  const { Accidental, Formatter, Renderer, Stave, StaveNote } = Vex.Flow

  let scoreWidth = 200
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

  function addParts(note: MidiNote, scale: Scale): MidiNote & { parts: [string, string, number] } {
    const scaleAccidentals = scale.flats > 0 ? scale.flats : scale.sharps
    const noteAccidentals = note.flats > 0 ? note.flats : note.sharps
    const accidental = note.flats > 0 ? 'b' : '#'
    // Retrieve the used accidented notes in the scale
    const notes = (scale.flats > 0 ? FLAT_NOTES : SHARP_NOTES).slice(0, scaleAccidentals)
    // Decrement the accidentals by 1 if the note has been accidented
    const count = notes.find(n => n === note.note.slice(0, 2))
      ? noteAccidentals - 1
      : noteAccidentals
    // If the note contains no accidentals _AND_ the note is accidented by default in the scale
    // -> use natural
    // @TODO/maybe double accidentals
    const naturalized =
      note.note.length === 1 && notes.find(n => n.charAt(0) === note.note.charAt(0))
    return {
      ...note,
      parts: [
        note.note.charAt(0),
        `${naturalized ? 'n' : accidental.repeat(count)}`,
        getOctave(note)
      ]
    }
  }

  function init() {
    renderer = new Renderer(outputEl, Renderer.Backends.SVG)
    renderer.resize(732, 496)
    ctx = renderer.getContext()
    ctx.scale(1.0, 1.0)
    // console.log('ctx', ctx)
    tickContext = new Vex.Flow.TickContext()
    const tclef = new Stave(0, 110, scoreWidth).addClef('treble').addKeySignature('B')
    const bclef = new Stave(0, 170, scoreWidth).addClef('bass').addKeySignature('B')
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
    formatter.format([v1, v2], scoreWidth - 10 - startX)
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
      const octave = getOctave(n)
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

  function createNotes(targetNotes: Vex.StaveNote[], playedNotes: Vex.StaveNote[]) {
    const trebleNotes = []
    const bassNotes = []
    targetNotes.forEach(n => {
      if (n.getAttribute('clef') === 'treble') {
        trebleNotes.push(n)
      } else {
        bassNotes.push(n)
      }
    })
    // @TODO hack with invisible notes
    // Aligns notes when target is on single staff so that played notes will be at the same x position
    if (trebleNotes.length === 0 && bassNotes.length > 0 && playedNotes.length > 0) {
      trebleNotes.push(
        new Vex.Flow.StaveNote({
          clef: 'treble',
          keys: ['G/4'],
          duration: 'w'
        }).setStyle({ fillStyle: '#fff' })
      )
    } else if (bassNotes.length === 0 && trebleNotes.length > 0 && playedNotes.length > 0) {
      bassNotes.push(
        new Vex.Flow.StaveNote({
          clef: 'bass',
          keys: ['F/3'],
          duration: 'w'
        }).setStyle({ fillStyle: '#fff' })
      )
    }
    trebleNotes.push(...playedNotes.filter(n => n.getAttribute('clef') === 'treble'))
    bassNotes.push(...playedNotes.filter(n => n.getAttribute('clef') === 'bass'))
    return [trebleNotes, bassNotes]
  }

  function updateNotes({ game, guessed, scale, played, target }: Data) {
    // console.log('hello target', target)
    // console.log('hello played', played)
    const key = scale.majorSignature.replaceAll('♭', 'b').replaceAll('♯', '#')
    scoreWidth = 200 + Math.max(scale.flats, scale.sharps) * 10
    ctx.clear()
    ctx.scale(1.0, 1.0)
    const tclef = new Stave(0, 170, scoreWidth).addClef('treble').addKeySignature(key)
    const bclef = new Stave(0, 230, scoreWidth).addClef('bass') //.addKeySignature(key)
    const targetNotes = notesToVexflowNotes(target, scale)
    // console.log('notes ', targetNotes)
    const playedNotes = notesToVexflowNotes(played, scale)
    const [trebleNotes, bassNotes] = createNotes(targetNotes, playedNotes)
    const voices: Vex.Voice[] = []
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
      formatter.format(voices, scoreWidth - 10 - startX)
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

<section class={`${$$props.class || ''} relative overflow-hidden`}>
  <div id="output" class="grid justify-start content-center" bind:this={outputEl}></div>
  <div class="absolute left-4 buttons">
    <div class="flex flex-col">
      <ReplayButton />
      <QuitButton />
    </div>
  </div>
</section>

<style lang="scss">
  #output {
    transform-origin: left;
    transform: scale(1.75);
  }
  .buttons {
    top: 23rem;
  }
  @media (width <= 508px) {
    #output {
      height: 420px;
      transform: scale(1.5);
    }
    .buttons {
      top: 20rem;
    }
  }
  @media (width <= 438px) {
    #output {
      height: 320px;
      transform: scale(1.15);
    }
    .buttons {
      top: 15rem;
    }
  }
  @media (width <= 344px) {
    #output {
      height: 300px;
      overflow: hidden;
      transform: scale(1.05);
    }
    .buttons {
      top: 13.75rem;
    }
  }
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
