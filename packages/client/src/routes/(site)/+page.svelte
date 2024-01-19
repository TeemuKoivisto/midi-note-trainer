<script lang="ts">
  import { onMount } from 'svelte'

  import MidiInfo from '$components/MidiInfo.svelte'
  import Score from '$components/Score.svelte'

  import { currentGame, gameActions } from '$stores/game'
  import { midiActions, midiInput } from '$stores/midi'
  import { getNote } from '$utils/midi'

  import type { NoteMessageEvent } from 'webmidi'
  import type { Note } from '@/types'

  let status = 'Finding device...'
  let playedEl: HTMLElement
  let targetEl: HTMLElement
  let ledgerLines = [] as { bottom: string }[]

  let targetNote = 0
  let playedNote = 0
  let target: Note | undefined
  let played: (Note & { correct: boolean }) | undefined
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
      played = { ...getNote(value), value, correct: false }
    } else {
      targetNote = $currentGame.current
      target = { ...getNote(targetNote), value: targetNote }
      const correct = $currentGame.guess(value)
      guessState = correct ? 'correct' : 'wrong'
      setPlayedNote(value, correct)
      played = { ...getNote(value), value, correct }
      timeout = setTimeout(() => {
        if ($currentGame?.ended) {
          setTargetNote()
          target = undefined
          guessState = 'ended'
        } else if ($currentGame) {
          setTargetNote($currentGame.current)
          target = { ...getNote($currentGame.current), value: $currentGame.current }
          guessState = 'waiting'
        }
        setPlayedNote()
        played = undefined
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
      const pos = positionNote(value)
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
      const target = getNote(value)
      const pos = positionNote(value)
      targetEl.style.bottom = `${pos}rem`
      targetEl.style.display = 'block'
      targetEl.textContent = `${target.flat ? '♭' : target.sharp ? '♯' : ''}𝅝`
    }
  }

  function drawLedgerLines(from: number, to: number) {
    // 81 >= every 3rd step
    // 60 -> middle C
    if (from === 60) {
      ledgerLines = [{ bottom: '0.02rem' }]
    } else if (from >= 81) {
      ledgerLines = [{ bottom: '4.97rem' }]
      for (let s = from; s <= to; s += 3) {
        console.log('line', s)
      }
    }
  }

  function positionNote(value: number) {
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
    guessState = 'waiting'
    const game = gameActions.playGuessNotes()
    const note = getNote(game.current)
    target = { ...note, value: game.current }
    setTargetNote(game.current)
    setPlayedNote()
  }
  function clearGame() {
    guessState = 'waiting'
    gameActions.clearGame()
  }
</script>

<h1 class="my-8 md:text-5xl mt-12 px-4 md:px-0 text-3xl font-cursive tracking-tight">
  Practise Music Reading
</h1>

<section class="px-4 md:px-0">
  <MidiInfo />
  {#if midiInput}
    <div>
      <button class="btn primary" on:click={playGuessNotes}>Guess 10 Notes</button>
    </div>
  {/if}
</section>

<Score class="my-4 px-4 md:px-0" {target} {played} />

<section>
  <section class="pt-12 pb-8 ml-[-0.5rem] md:ml-[-1.6rem] score">
    <div class="line">
      <span class="g-clef">𝄞</span>
      <span class="staff">𝄚</span>
      <span class="note target" bind:this={targetEl}></span>
      <span class="note played" bind:this={playedEl}></span>
      <!-- <span class="note ex">𝅝</span>
      <span class="ledger-line"></span>
      <span class="note ex2">♯𝅝</span> -->
      <!-- <span class="note ex2"></span> -->
      <!-- <span class="ledger-line2"></span> -->
      <!-- {#each ledgerLines as line}
        <span class="ledger-line" style:bottom={line.bottom}></span>
      {/each} -->
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
          <div>Result: {$currentGame.correct} / {$currentGame.notes.length}</div>
          <div>
            <button class="btn primary" on:click={playGuessNotes}>Try Again</button>
            <button class="btn primary" on:click={clearGame}>Clear</button>
          </div>
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
      left: 2.5rem;
      line-height: 1;
      position: absolute;
    }
    .f-clef {
      bottom: 0.7rem;
      font-size: 3rem;
      left: 2.5rem;
      position: absolute;
    }
    .staff {
      display: block;
      font-size: 3.5rem;
      line-height: 1.42;
      transform: scale(10, 1);
      transform-origin: 0 50%;
      width: 61.6px;
      @media (width <= 605px) {
        transform: scale(5, 1);
        transform-origin: -6% 50%;
      }
    }
    .note {
      font-size: 3.1rem;
      // line-height: 1;
      position: absolute;
    }
    .target {
      left: 7rem;
      pointer-events: none;
    }
    .played {
      bottom: 2.6rem;
      display: none;
      left: 10rem;
      pointer-events: none;
      position: absolute;
    }
    .ex {
      bottom: -0.4rem;
      left: 10rem;
      line-height: 1;
    }
    .ledger-line {
      border-top: 1.25pt solid #222;
      bottom: -0.02rem;
      font-size: 3.1rem;
      left: 9.8rem;
      line-height: 1;
      pointer-events: none;
      position: absolute;
      width: 2rem;
    }
    .ex2 {
      bottom: 3.81709rem;
      left: 12rem;
      position: absolute;
      &::after {
        content: '¯¯¯';
        font-size: 1.2rem;
        position: relative;
        right: 1.69rem;
        top: 0.55rem;
      }
    }
    .ledger-line2 {
      border-top: 1.25pt solid #222;
      bottom: 4.97rem;
      font-size: 3.1rem;
      left: 11.8rem;
      line-height: 1;
      pointer-events: none;
      position: absolute;
      width: 2rem;
    }
  }
  :global(.wrong) {
    color: red;
  }
  :global(.correct) {
    @apply text-green-500;
  }
</style>
