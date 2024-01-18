<script lang="ts">
  import { onMount } from 'svelte'
  import { WebMidi } from 'webmidi'

  import type { Input } from 'webmidi'

  import { C_MAJOR_NOTES, midiToNote } from './midi'

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
  })

  function handleMidiFound(input: Input) {
    console.log(playedEl)
    input.channels[1].addListener('noteon', e => {
      console.log('noteon', e)
      // @ts-ignore
      const data = e.rawData as [number, number, number]
      const semiTonesFromC4 = data[1] - 60
      const note = C_MAJOR_NOTES[(semiTonesFromC4 % 12) as keyof typeof C_MAJOR_NOTES]
      const pos = positionNote('g', data[1])
      console.log(`note ${data[1]} pos ${pos}`)
      console.log(midiToNote(data[1]))
      playedEl.style.bottom = `${pos}rem`
      playedEl.style.display = 'block'
      playedEl.textContent = `${note.flat ? '♭' : note.sharp ? '♯' : ''}𝅝`
    })
  }

  function positionNote(clef: 'f' | 'g', value: number) {
    const middle = 0.5 // rem
    const stepSize = 0.41809090909 // rem
    // bottom: -5.75rem; -16
    // step = (-5.75 - 1.36) / -17 = 0.41823529411
    // f2 bottom: 1.77rem;
    // g5 bottom: 3.463rem;
    // f2 bottom: -5.735rem;
    // step = (-5.735 -3.463) / -22 = 0.41809090909
    const semiTonesFromC4 = value - 60
    // Center the note from C0 which equals 12 in MIDI values, then get the sequence after C
    const note = C_MAJOR_NOTES[(semiTonesFromC4 % 12) as keyof typeof C_MAJOR_NOTES]
    const octaves = Math.floor(Math.abs(semiTonesFromC4) / 12)
    if (clef === 'f') {
      // middle note is d3
      return middle + stepSize * (value - 50)
    } else if (clef === 'g') {
      let steps
      if (semiTonesFromC4 >= 0) {
        // higher than C4
        steps = octaves * 7 + note.steps
      } else {
        // lower than C4
        steps = -1 * (octaves * 7 + note.steps === 0 ? 0 : 7 - note.steps)
      }
      // Adjust the position -1.2rem being the value for C4 in G-treble
      console.log(`steps ${steps}`)
      return -1.2 + stepSize * steps
    } else {
      console.warn('Unrecognized clef: ', clef)
    }
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
      <span class="note g4 target">♯𝅝</span>
      <span class="note played" bind:this={playedEl}>𝅝</span>
    </div>
    <div class="line">
      <span class="f-clef">𝄢</span>
      <span class="staff">𝄚</span>
      <span class="note f3">𝅝</span>
      <span class="note g3">𝅝</span>
      <span class="note a3">𝅝</span>
      <span class="note b3">𝅝</span>
      <span class="note c4">♯𝅝</span>
      <span class="note d4">𝅝</span>
      <span class="note e4">𝅝</span>
      <span class="note g4"></span>
    </div>
  </section>
  <div class="bravura">
    𝄆 𝄞𝄰 𝅗𝅥𝅘𝅥𝅮𝅘𝅥𝅮𝅘𝅥 𝄇
    <div class="line">
      <span class="g-clef"></span>
      <span class="f-clef"></span>
      <span class="f-clef">𝄢</span>
      <span class="note g4 target">♯𝅝</span>
    </div>
    
  </div>
</section>

<p class="pl-2">hello</p>

<style lang="scss">
  .bravura {
    font-family: 'Bravura Text', sans-serif;
    font-size: 4rem;
  }
  .score {
    display: flex;
    flex-direction: column;
    font-family: 'Noto Music', sans-serif;
    .line {
      position: relative;
    }
    .g-clef {
      bottom: 0.8rem;
      font-size: 3.3rem;
      left: 1rem;
      line-height: 1;
      position: absolute;
    }
    .f-clef {
      bottom: 0.7rem;
      font-size: 3rem;
      left: 1rem;
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
      display: none;
      left: 7rem;
      position: absolute;
    }
  }
</style>
