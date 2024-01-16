<script lang="ts">
  import { onMount } from 'svelte'
  import { WebMidi } from 'webmidi'

  import type { Input } from 'webmidi'

  let status = ''
  let error = ''
  let canvasEl: HTMLCanvasElement

  onMount(() => {
    status = ''
    draw()
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
    input.channels[1].addListener('noteon', e => {
      console.log('noteon', e)
    })
  }

  function draw() {
    var img = new Image()
    img.src = '/g_clef.svg'
    const ctx = canvasEl.getContext('2d')
    if (!ctx) return
    var canvasW = canvasEl.width,
      canvasH = canvasEl.height
    var imgW = img.naturalWidth || canvasW,
      imgH = img.naturalHeight || canvasH
    var ratio = canvasW / imgW
    ctx.rect(0, 0, 200, 200)
    ctx.fillStyle = 'black'
    ctx.fill()
    ctx?.drawImage(img, 0, 0, imgW * ratio, imgH * ratio)
    img.onload = function () {
      console.log('img', img)
      ctx?.drawImage(img, 0, 0)
      ctx.fillStyle = 'red'
      ctx.fill()
      // ctx?.drawImage(img, 0, 0, imgW * ratio, imgH * ratio)
    }
  }
</script>

<h1 class="font-cursive my-8 text-5xl md:text-7xl mt-20 mb-16 tracking-tight">
  Practise Music Reading
</h1>

<section class="pl-1">
  <p>
    {status}
  </p>
  {#if error}
    <span>{error}</span>
  {/if}
  <div class="score">
    <span class="g-clef">𝄞</span>
    <span class="lines">𝄚</span>
    <span class="note">𝅝</span>
  </div>
  <!-- <canvas id="score" bind:this={canvasEl} /> -->
</section>

<p>hello</p>

<style lang="scss">
  section {
    font-family: 'Noto Music', sans-serif;
  }
  .score {
    display: flex;
    position: relative;
    .g-clef {
      bottom: 10px;
      font-size: 8rem;
      left: 1.5rem;
      line-height: 1;
      position: absolute;
    }
    .lines {
      display: block;
      font-size: 5rem;
      transform: scale(8, 1);
      transform-origin: 2% 50%;
    }
    .note {
      bottom: 18px;
      font-size: 4rem;
      left: 85px;
      position: absolute;
    }
  }
</style>
