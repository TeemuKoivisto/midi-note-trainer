<script lang="ts">
  import { onMount } from 'svelte'

  import MidiInfo from '$components/MidiInfo.svelte'

  import { currentGame, gameActions } from '$stores/game'
  import { midiActions, midiInput } from '$stores/midi'
  import { getNote } from '$utils/midi'

  import type { NoteMessageEvent } from 'webmidi'

  let status = 'Finding device...'
  let playedEl: HTMLElement
  let targetEl: HTMLElement

  let targetNote = 0
  let playedNote = 0
  let timeout: ReturnType<typeof setTimeout> | undefined
  let guessState: 'waiting' | 'correct' | 'wrong' | 'ended'

  onMount(() => {
    handlePromptMIDI()
  })

  midiInput.subscribe(input => {
    if (input) {
      input.channels[1].addListener('noteon', noteOnListner)
    }
  })

  function noteOnListner(e: NoteMessageEvent) {
    if (timeout) return
    console.log('noteon', e)
    // @ts-ignore
    const data = e.rawData as [number, number, number]
    const value = data[1]

    if (!$currentGame) {
      setPlayedNote(value)
    } else {
      targetNote = $currentGame.current
      const correct = $currentGame.guess(value)
      guessState = correct ? 'correct' : 'wrong'
      setPlayedNote(value, correct)
      timeout = setTimeout(() => {
        if ($currentGame?.ended) {
          setTargetNote()
          guessState = 'ended'
        } else if ($currentGame) {
          setTargetNote($currentGame.current)
          guessState = 'waiting'
        }
        setPlayedNote()
        timeout = undefined
      }, 2000)
    }
  }

  function setPlayedNote(value?: number, correct?: boolean) {
    if (value === undefined) {
      playedEl.style.display = 'none'
      playedEl.classList.remove('correct')
      playedEl.classList.remove('wrong')
      playedNote = 0
    } else {
      const note = getNote(value)
      const pos = positionNote('g', value)
      console.log(`played note ${value} pos ${pos}`)
      playedEl.style.bottom = `${pos}rem`
      playedEl.style.display = 'block'
      playedEl.textContent = `${note.flat ? '♭' : note.sharp ? '♯' : ''}𝅝`
      if (correct) {
        playedEl.classList.remove('wrong')
        playedEl.classList.add('correct')
      } else {
        playedEl.classList.remove('correct')
        playedEl.classList.add('wrong')
      }
      playedNote = value
    }
  }

  function setTargetNote(value?: number) {
    if (value === undefined) {
      targetEl.style.display = 'none'
      targetNote = 0
    } else {
      console.log(`hey new target note ${value}`)
      const target = getNote(value)
      const pos = positionNote('g', value)
      targetEl.style.bottom = `${pos}rem`
      targetEl.style.display = 'block'
      targetEl.textContent = `${target.flat ? '♭' : target.sharp ? '♯' : ''}𝅝`
    }
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
    const note = getNote(value)
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

  async function handlePromptMIDI() {
    status = 'Finding device...'
    const res = await midiActions.openMidi()
    if ('data' in res) {
      status = res.data.name
    } else {
      status = res.err
    }
  }

  function playGuessNotes() {
    const game = gameActions.playGuessNotes()
    setTargetNote(game.current)
    setPlayedNote()
  }
</script>

<h1 class="font-cursive my-8 text-3xl md:text-5xl mt-12 tracking-tight">Practise Music Reading</h1>

<section>
  <MidiInfo />
  {#if midiInput}
    <div>
      <button class="btn primary" on:click={playGuessNotes}>Guess 10 Notes</button>
    </div>
  {/if}
</section>

<section class="pl-2">
  <section class="pt-8 score">
    <div class="line">
      <span class="g-clef">𝄞</span>
      <span class="staff">𝄚</span>
      <span class="note target" bind:this={targetEl}></span>
      <span class="note played" bind:this={playedEl}></span>
    </div>
    <div class="line">
      <span class="f-clef">𝄢</span>
      <span class="staff">𝄚</span>
    </div>
  </section>
  {#if $currentGame}
    <div class="objective">
      {#if guessState === 'correct' || guessState === 'wrong'}
        <div>Target: {getNote(targetNote).absolute}</div>
        <div class="ml-8">Played: {getNote(playedNote).absolute}</div>
      {:else if guessState === 'ended'}
        <div>
          Result: {$currentGame.correct} / {$currentGame.notes.length}
        </div>
      {/if}
    </div>
  {:else}
    <div class="objective">
      {#if playedNote > 0}
        <div>Played: {getNote(playedNote).absolute}</div>
      {/if}
    </div>
  {/if}
</section>

<style lang="scss">
  .objective {
    display: flex;
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
    .target {
      left: 5rem;
      pointer-events: none;
    }
    .played {
      bottom: 2.6rem;
      display: none;
      left: 9rem;
      pointer-events: none;
      position: absolute;
    }
  }
  :global(.wrong) {
    color: red;
  }
  :global(.correct) {
    @apply text-green-500;
  }
</style>
