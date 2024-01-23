<script lang="ts">
  import { played, target } from '$stores/game'
  import Vex from 'vexflow'

  const { Factory, EasyScore, System, Renderer, Stave, StaveNote } = Vex.Flow

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
    renderer.resize(800, 300)
    const context = renderer.getContext()
    const s1 = new Stave(10, 40, 200)
    s1.addClef('treble').addTimeSignature('4/4')
    Vex.Flow.Formatter.FormatAndDraw(context, s1, [
      new StaveNote({ keys: ['c/4'], duration: 'q' }),
      new StaveNote({ keys: ['d/4'], duration: 'q' }),
      new StaveNote({ keys: ['b/4'], duration: 'qr' }),
      new StaveNote({ keys: ['c/4', 'e/4', 'g/4'], duration: 'q' })
    ])
    const s2 = new Stave(210, 40, 150)
    Vex.Flow.Formatter.FormatAndDraw(context, s2, [
      new StaveNote({ keys: ['c/4'], duration: 'q' }),
      new StaveNote({ keys: ['d/4'], duration: 'q' }),
      new StaveNote({ keys: ['b/4'], duration: 'qr' }),
      new StaveNote({ keys: ['c/4', 'e/4', 'g/4'], duration: 'q' })
    ])
    s1.setContext(context).draw()
    s2.setContext(context).draw()
  }

  function updateNotes(target: Note, played?: Note, correct?: boolean) {
    const ctx = renderer.getContext()
    ctx.clear()
    const s1 = new Stave(10, 40, 200)
    s1.addClef('treble').addTimeSignature('4/4')
    const notes = [
      new Vex.Flow.StaveNote({
        clef: 'treble',
        keys: [`${target.note}/${target.octave}`.replaceAll('♯', '#').replaceAll('♭', 'b')],
        duration: 'h'
      })
    ]
    if (played) {
      notes.push(
        new Vex.Flow.StaveNote({
          clef: 'treble',
          keys: [`${played.note}/${played.octave}`.replaceAll('♯', '#').replaceAll('♭', 'b')],
          duration: 'h'
        })
      )
    } else {
      notes.push(new StaveNote({ keys: ['g/4'], duration: 'hr' }))
    }
    Vex.Flow.Formatter.FormatAndDraw(ctx, s1, notes)
    s1.setContext(ctx).draw()
    // console.log('draw ', notes)
  }
</script>

<section class={`${$$props.class || ''} score pt-12 pb-8`}>
  <div id="output" bind:this={outputEl}></div>
</section>

<style lang="scss">
  :global(.hidden) {
    display: none;
  }
</style>
