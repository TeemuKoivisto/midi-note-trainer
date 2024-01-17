<script lang="ts">
  import { onMount } from 'svelte'
  import { WebMidi } from 'webmidi'

  import type { Input } from 'webmidi'

  import { midiToNote } from './midi'

  let status = ''
  let error = ''
  let playedEl: HTMLElement

  onMount(() => {
    status = ''
    // Enable WebMidi.js and trigger the onEnabled() function when ready.
    WebMidi.enable()
      .then(() => {
        if (WebMidi.inputs.length > 0) {
          handleMidiFound(WebMidi.inputs[0])
        } else {
          status = 'No MIDI device found.'
        }
      })
      .catch(err => {
        console.error(err)
        error = err.toString()
      })

    function onEnabled() {
      if (WebMidi.inputs.length < 1) {
        status += 'No device detected.'
      } else {
        WebMidi.inputs.forEach((device, index) => {
          status += `${index}: ${device.name} <br>`
        })
      }

      const mySynth = WebMidi.inputs[0]
      // const mySynth = WebMidi.getInputByName("TYPE NAME HERE!")

      mySynth.channels[1].addListener('noteon', e => {
        status += `${e.note.name} <br>`
      })
    }
  })

  function handleMidiFound(input: Input) {
    console.log(playedEl)
    input.channels[1].addListener('noteon', e => {
      console.log('noteon', e)
      // @ts-ignore
      const note = midiToNote(e.rawData[1])
      console.log(note)
      switch (note) {
        case 'E4':
          // playedEl.style.bottom = '6px'
          playedEl.style.bottom = '10pt'
          break
        case 'F4':
          // playedEl.style.bottom = '6px'
          playedEl.style.bottom = '17pt'
          break
        case 'G4':
          // playedEl.style.bottom = '16px'
          playedEl.style.bottom = '25pt'
          break
        case 'A4':
          // playedEl.style.bottom = '25px'
          playedEl.style.bottom = '32pt'
          break
        case 'B4':
          playedEl.style.bottom = '39pt'
          break
        case 'C4':
          playedEl.style.bottom = '46pt'
          break
      }
    })
  }
</script>

<h1 class="font-cursive my-8 text-5xl md:text-7xl mt-20 mb-16 tracking-tight">
  Practise Music Reading
</h1>

<section class="pl-2">
  <p>
    {status}
  </p>
  {#if error}
    <span>{error}</span>
  {/if}
  <section class="pt-8 score">
    <div class="line">
      <span class="g-clef">𝄞</span>
      <span class="staff">𝄚</span>
      <span class="note g4 target">𝅝</span>
      <span class="note played" bind:this={playedEl}>𝅝</span>
    </div>
    <div class="line">
      <span class="f-clef">𝄢</span>
      <span class="staff">𝄚</span>
      <span class="note f3">𝅝</span>
      <span class="note g3">𝅝</span>
      <span class="note a3">𝅝</span>
      <span class="note b3">𝅝</span>
      <span class="note c4">𝅝</span>
      <span class="note d4">𝅝</span>
      <span class="note e4">𝅝</span>
      <span class="note g4">𝅝</span>
    </div>
  </section>
</section>

<p class="pl-2">hello</p>

<style lang="scss">
  section {
    font-family: 'Noto Music', sans-serif;
  }
  .score {
    display: flex;
    flex-direction: column;
    .line {
      position: relative;
    }
    .g-clef {
      bottom: -0.7rem;
      font-size: 8rem;
      left: 1rem;
      line-height: 1;
      position: absolute;
    }
    .f-clef {
      bottom: 1.2rem;
      font-size: 4.4rem;
      left: 1rem;
      line-height: 1;
      position: absolute;
    }
    .staff {
      display: block;
      font-size: 3.5rem;
      line-height: 1.42;
      transform: scale(13, 1);
      transform-origin: 0.4% 50%;
    }
    .note {
      font-size: 3.1rem;
      // line-height: 1;
      position: absolute;
    }
    .f3 {
      bottom: 2.2rem;
      left: 5rem;
    }
    .g3 {
      bottom: 2.62rem;
      left: 6.1rem;
    }
    .a3 {
      bottom: 3.04rem;
      left: 7.2rem;
    }
    .b3 {
      bottom: 3.46rem;
      left: 8.3rem;
    }
    .c4 {
      bottom: 3.88rem;
      left: 9.4rem;
    }
    .d4 {
      bottom: 4.2rem;
      left: 8.3rem;
    }
    .e4 {
      bottom: 4.5rem;
      left: 10.5rem;
    }
    .g4 {
      bottom: 0.5rem;
      left: 5rem;
    }
    .target {
      left: 5rem;
    }
    .played {
      bottom: 2.6rem;
      color: red;
      left: 7rem;
      position: absolute;
    }
  }
</style>
