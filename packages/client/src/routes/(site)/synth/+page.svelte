<script lang="ts">
  import { onMount } from 'svelte'

  import { Clock } from '$utils/clock'
  import { SynthPlayer } from '$utils/synth_player'

  let context
  let clock
  let synthPlayer

  onMount(() => {
    context = new AudioContext()
    clock = new Clock(
      {
        numBeats: 12,
        tempo: 90 * 3
        // The pattern is is 12/8 time, so there are three parts per beat.
      },
      context
    )
    synthPlayer = new SynthPlayer(
      {
        //  1 3  6 8 a
        // 0 2 45 7 9 b
        // Major: 024579b
        // Minor: 02357(8a,9b)
        clock: clock,
        octave: 5,
        pattern: [
          '888   888555', // Minor fourth + 7
          '555   23 555', // Flat-seventh major + 9
          '  55554444 0', // Tonic major + 7/11 -> + 7
          '444444477777' // Tonic major + 7
        ]
      },
      context
    )
  })

  function play() {
    context!.resume().then(() => {
      console.log('Playback resumed successfully')
    })
  }
</script>

<h1 class="my-8 md:text-5xl mt-12 px-4 md:px-0 text-3xl font-cursive tracking-tight">Synth</h1>

<section class="px-4 md:px-0">
  <button class="btn primary" on:click={play}>Play</button>
</section>

<style lang="scss">
  .objective {
    display: flex;
  }
</style>
