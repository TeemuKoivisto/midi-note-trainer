<script lang="ts">
  import Vex from 'vexflow'

  import { currentGame, guessState, type GuessState } from '$stores/game'
  import { score } from '$stores/score'

  const { Accidental, EasyScore, Factory, Formatter, System, Renderer, Stave, StaveNote } = Vex.Flow

  import type { Note } from '@/types'
  import { onMount } from 'svelte'
  import { derived } from 'svelte/store'
  import type { GuessGame } from '$utils/guess_game'

  let outputEl: HTMLDivElement
  let renderer: Vex.Renderer
  let ctx: Vex.RenderContext
  let tickContext: Vex.TickContext

  const data = derived([currentGame, guessState, score], ([c, g, s]) => ({
    game: c,
    guessed: g,
    score: s
  }))

  onMount(() => {
    init()
    data.subscribe(d => updateNotes(d))
  })

  function init() {
    renderer = new Renderer(outputEl, Renderer.Backends.SVG)
    renderer.resize(732, 340)
    ctx = renderer.getContext()
    ctx.scale(2.0, 2.0)
    // console.log('ctx', ctx)
    tickContext = new Vex.Flow.TickContext()
    const s1 = new Stave(10, 0, 200)
    s1.addClef('treble') //.addTimeSignature('4/4')
    const notes = [
      new StaveNote({ keys: ['c#/4'], duration: 'q' }),
      new StaveNote({ clef: 'bass', keys: ['d/4'], duration: 'q' }),
      new StaveNote({ keys: ['b/4'], duration: 'qr' }),
      new StaveNote({ keys: ['c/4', 'e/4', 'g/4'], duration: 'q' })
    ]
    const voice = new Vex.Flow.Voice({ num_beats: 4, beat_value: 4 }).addTickables(notes)
    // const formatter = new Vex.Flow.Formatter()
    // formatter.joinVoices([voice]).formatToStave([voice], s1)
    const formatter = new Vex.Flow.Formatter().joinVoices([voice]).formatToStave([voice], s1)
    voice.draw(ctx, s1)
    // console.log(notes[1].getStave())
    // Vex.Flow.Formatter.FormatAndDraw(context, s1, notes)
    const s2 = new Stave(10, 60, 200)
    s2.addClef('bass')
    s1.setContext(ctx).draw()
    s2.setContext(ctx).draw()
  }

  function drawNote(
    note: Note,
    treble: Vex.Stave,
    bass: Vex.Stave,
    correct?: boolean
  ): { note: Vex.StemmableNote; clef: 'treble' | 'bass' } {
    const clef = note.octave >= 4 ? 'treble' : 'bass'
    const snote = new Vex.Flow.StaveNote({
      clef,
      keys: [`${note.parts[0]}${note.parts[1]}/${note.parts[2]}`],
      duration: 'w'
    })
    if (correct !== undefined) {
      snote.setStyle({ fillStyle: correct ? 'rgb(34, 197, 94)' : 'red' })
    }
    const stave = clef === 'treble' ? treble : bass
    snote.setContext(ctx).setStave(stave)
    if (note.parts[1]) {
      snote.addModifier(new Accidental(note.parts[1]))
    }
    tickContext.addTickable(snote)
    return { note: snote, clef }
  }

  function drawNotesToStaves(
    trebleStave: Vex.Stave,
    bassStave: Vex.Stave,
    notes: { note: Vex.StemmableNote; clef: 'treble' | 'bass' }[]
  ) {
    const trebleNotes = notes.filter(n => n.clef === 'treble').map(n => n.note)
    const bassNotes = notes.filter(n => n.clef === 'bass').map(n => n.note)
    if (trebleNotes.length > 0) {
      Formatter.FormatAndDraw(ctx, trebleStave, trebleNotes)
    }
    if (bassNotes.length > 0) {
      Formatter.FormatAndDraw(ctx, bassStave, bassNotes)
    }
  }

  function updateNotes({
    game,
    guessed,
    score
  }: {
    game: GuessGame | undefined
    guessed: GuessState
    score: {
      key: string
      target: Note | undefined
      played: (Note & {
        started: number
      })[]
    }
  }) {
    // console.log('hello notes', notes)
    ctx.clear()
    ctx.scale(0.5, 0.5)
    const s1 = new Stave(10, 0, 200).addClef('treble').addKeySignature(score.key)
    const s2 = new Stave(10, 60, 200).addClef('bass')
    const staveNotes = []
    if (score.target) {
      staveNotes.push(drawNote(score.target, s1, s2))
    }
    score.played.forEach(n => {
      const correct = game?.guessed === n.value && guessed === 'correct'
      staveNotes.push(drawNote(n, s1, s2, correct))
    })
    drawNotesToStaves(s1, s2, staveNotes)
    s1.setContext(ctx).draw()
    s2.setContext(ctx).draw()
    // console.log('draw ', notes)
  }
</script>

<section class={`${$$props.class || ''}`}>
  <div id="output" bind:this={outputEl}></div>
</section>

<style lang="scss">
  :global(.hidden) {
    display: none;
  }
</style>
