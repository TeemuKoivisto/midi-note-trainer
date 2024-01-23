<script lang="ts">
  import { played, target } from '$stores/game'
  import Vex from 'vexflow'

  const { Factory, EasyScore, System, Renderer, Stave } = Vex.Flow

  import type { Note } from '@/types'
  import { onMount } from 'svelte'

  let vf: Vex.Factory
  let score: Vex.EasyScore
  let system: Vex.System
  let outputEl: HTMLDivElement

  $: {
    if (typeof window !== undefined) {
      $target && updateNotes($target, $played, $played?.correct)
    }
  }

  onMount(() => {
    init()
  })

  function init() {
    vf = new Factory({
      renderer: { elementId: 'output', width: 500, height: 200 }
    })

    score = vf.EasyScore()
    system = vf.System()
    system
      .addStave({
        voices: [score.voice(score.notes('F#4/w', { stem: 'down' }))]
      })
      .addClef('treble')
      .addTimeSignature('4/4')
      .addKeySignature('Db')
      .addClass('hidden')
    vf.draw()
  }

  function updateNotes(target?: Note, played?: Note, correct?: boolean) {
    const t = `${target ? target.absolute + '/w' : ''} ${played ? played.absolute + '/w' : ''}`
    console.log('draw ', t)
    system = vf.System()
    const ctx = system.getContext()
    ctx?.clear()
    const voice = score.voice(
      score.notes(t.replaceAll('♯', '#').replaceAll('♭', 'b'), { stem: 'up' })
    )
    let formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], 400)
    system
      .addStave({
        voices: [voice]
      })
      .addClef('treble')
      .addTimeSignature('4/4')
      .addKeySignature('Db')
      .format()

    vf.draw()
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
