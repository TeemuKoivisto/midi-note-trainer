<script lang="ts">
  import { onMount } from 'svelte'

  import { Clock } from '$utils/clock'
  import { SynthPlayer } from '$utils/synth_player'
  import { Piano } from '$utils/piano'

  let context
  let clock
  let synthPlayer
  let piano: Piano

  onMount(() => {
    context = new AudioContext()
    piano = new Piano(context)
  })

  function synth() {
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
          '888888888888', // Minor fourth + 7
          '222222222222', // Flat-seventh major + 9
          '555555444444', // Tonic major + 7/11 -> + 7
          '444444444444' // Tonic major + 7
        ]
        // pattern: [
        //     '333333333333', // Minor fourth + 7
        //     '000000000000', // Flat-seventh major + 9
        //     'bbbbbbbbbbbb', // Tonic major + 7/11 -> + 7
        //     'bbbbbbbbbbbb', // Tonic major + 7
        // ],
        // staticConfig: function() {
        //     this.osc1gain.gain.value = 0.3;
        //     this.osc2gain.gain.value = 0.5;
        //     this.filter.frequency.value = 2000;
        //     this.filter.Q.value = 8;
        //     this.pan.setPosition(0.1, 0, 0.1);
        //     this.gain.gain.value = 0.15;
        // },
        // dynamicConfig: {
        //     attack: 0.5,
        //     decay: 0.1,
        //     sustain: 0.9,
        //     release: 0.5
        // }
        // pattern: [
        //     '558855535555', // Minor fourth + 7
        //     'a aaaa222222', // Flat-seventh major + 9
        //     '000555444000', // Tonic major + 7/11 -> + 7
        //     '000  b000444', // Tonic major + 7
        // ],
        // pattern: [
        //   '888   888555', // Minor fourth + 7
        //   '555   23 555', // Flat-seventh major + 9
        //   '  55554444 0', // Tonic major + 7/11 -> + 7
        //   '444444477777' // Tonic major + 7
        // ]
      },
      context
    )
  }

  function play() {
    context!.resume().then(() => {
      console.log('Playback resumed successfully')
      piano.noteOn(60, 120)
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
