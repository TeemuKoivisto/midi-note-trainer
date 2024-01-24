<script lang="ts">
  import { played, target } from '$stores/game'
  import Vex from 'vexflow'

  const { Accidental, Factory, EasyScore, System, Renderer, Stave, StaveNote } = Vex.Flow

  import type { Note } from '@/types'
  import { onMount } from 'svelte'

  let outputEl: HTMLDivElement
  let renderer: Vex.Renderer

  $: {
    if (typeof window !== undefined) {
      $target && updateNotes($target, $played, $played?.correct)
    }
  }

  onMount(() => {
    init()
  })

  function init() {
    renderer = new Renderer(outputEl, Renderer.Backends.SVG)
    renderer.resize(732, 300)
    const ctx = renderer.getContext()
    const s1 = new Stave(10, 40, 200)
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
    const s2 = new Stave(10, 110, 200)
    s2.addClef('bass')
    s1.setContext(ctx).draw()
    s2.setContext(ctx).draw()
  }

  function createNote(note: Note): { sn: Vex.StaveNote; clef: 'treble' | 'bass' } {
    const sn = new Vex.Flow.StaveNote({
      clef: note.octave >= 4 ? 'treble' : 'bass',
      keys: [`${note.parts[0]}${note.parts[1]}/${note.parts[2]}`],
      duration: 'h'
    })
    if (note.parts[1]) {
      sn.addModifier(new Accidental(note.parts[1]))
    }
    return { sn, clef: note.octave >= 4 ? 'treble' : 'bass' }
  }

  function updateNotes(target: Note, played?: Note, correct?: boolean) {
    const ctx = renderer.getContext()
    ctx.clear()
    const s1 = new Stave(10, 40, 200)
    s1.addClef('treble') //.addTimeSignature('4/4')
    const s2 = new Stave(10, 110, 200)
    s2.addClef('bass')
    const trebleNotes = []
    const bassNotes = []
    const t = createNote(target)
    if (t.clef === 'treble') {
      trebleNotes.push(t.sn)
      bassNotes.push(new StaveNote({ keys: ['g/4'], duration: 'hr' }))
    } else {
      bassNotes.push(t.sn)
      trebleNotes.push(new StaveNote({ keys: ['g/4'], duration: 'hr' }))
    }
    if (played) {
      const t = createNote(played)
      if (t.clef === 'treble') {
        trebleNotes.push(t.sn)
      } else {
        bassNotes.push(t.sn)
      }
    } else {
      if (trebleNotes.length > 0) {
        trebleNotes.push(new StaveNote({ keys: ['g/4'], duration: 'hr' }))
      } else {
        bassNotes.push(new StaveNote({ keys: ['g/4'], duration: 'hr' }))
      }
    }
    Vex.Flow.Formatter.FormatAndDraw(ctx, s1, trebleNotes)
    Vex.Flow.Formatter.FormatAndDraw(ctx, s2, bassNotes)
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
