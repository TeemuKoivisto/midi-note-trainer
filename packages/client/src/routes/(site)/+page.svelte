<script lang="ts">
  import { onMount } from 'svelte'

  import MidiInfo from '$components/MidiInfo.svelte'
  import Score from '$components/Score.svelte'

  import { currentGame, gameActions } from '$stores/game'
  import { useKeyboard, midiActions, midiInput, piano } from '$stores/midi'
  import { getNote, parseNote } from '$utils/midi'

  import type { NoteMessageEvent } from 'webmidi'
  import type { Note } from '@/types'

  let status = 'Finding device...'

  let target: Note | undefined
  let played: (Note & { correct: boolean }) | undefined
  let timeout: ReturnType<typeof setTimeout> | undefined
  let guessState: 'waiting' | 'correct' | 'wrong' | 'ended'

  const regexNote = /^[A-G]$/
  const regexPosInt = /^[0-9]$/
  let keyboardError = ''
  let keyboardInput = ''

  onMount(() => {
    handlePromptMIDI()
  })

  midiInput.subscribe(input => {
    if (input) {
      input.channels[1].addListener('noteon', noteOnListener)
    }
  })

  function noteOnListener(e: NoteMessageEvent) {
    if (timeout) return
    console.log('noteon', e)
    // @ts-ignore
    const data = e.rawData as [number, number, number]
    handlePlayedNote(data[1], data[2])
  }
  function handlePlayedNote(value: number, velocity: number) {
    if (!$currentGame) {
      played = { ...getNote(value), value, correct: false }
    } else {
      target = { ...getNote($currentGame.current), value: $currentGame.current }
      const correct = $currentGame.guess(value)
      guessState = correct ? 'correct' : 'wrong'
      played = { ...getNote(value), value, correct }
      timeout = setTimeout(() => {
        if ($currentGame?.ended) {
          target = undefined
          guessState = 'ended'
        } else if ($currentGame) {
          target = { ...getNote($currentGame.current), value: $currentGame.current }
          guessState = 'waiting'
          $currentGame.startTime()
        }
        played = undefined
        timeout = undefined
      }, 2000)
    }
    if ($piano) {
      $piano.noteOn(value, velocity)
    }
  }
  function handleKeyDown(e: KeyboardEvent) {
    if ($useKeyboard && !timeout) {
      const pressed = e.key.toUpperCase()
      const zeroPressed = keyboardInput.length === 0
      const onePressed = keyboardInput.length === 1
      const twoPressed = keyboardInput.length === 2
      if (zeroPressed && regexNote.test(pressed)) {
        keyboardInput = pressed
        keyboardError = ''
      } else if (onePressed && pressed === 'B') {
        keyboardInput += '♭'
      } else if (onePressed && pressed === 'S') {
        keyboardInput += '♯'
      } else if (
        (onePressed && regexPosInt.test(pressed)) ||
        (twoPressed && regexPosInt.test(pressed))
      ) {
        // Octave pressed
        const note = parseNote(keyboardInput + pressed)
        if ('data' in note) {
          handlePlayedNote(note.data, 120)
        } else {
          keyboardError = `Error: ${note.err}`
        }
        keyboardInput = ''
      } else if (e.key === 'Backspace' && !zeroPressed) {
        keyboardInput = keyboardInput.slice(0, -1)
      }
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
    guessState = 'waiting'
    const game = gameActions.playGuessNotes()
    const note = getNote(game.current)
    target = { ...note, value: game.current }
  }
  function clearGame() {
    guessState = 'waiting'
    gameActions.clearGame()
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<h1 class="my-8 md:text-5xl mt-12 px-4 md:px-0 text-3xl font-cursive tracking-tight">
  MIDI Music Notation Trainer
</h1>

<section class="px-4 md:px-0">
  <MidiInfo />
  {#if midiInput}
    <div>
      <button class="btn primary" on:click={playGuessNotes}>Guess 10 Notes</button>
    </div>
  {/if}
</section>

<Score class="px-4 md:px-0" {target} {played} />

<section class="px-4 md:px-0">
  {#if $currentGame}
    <div class="objective">
      {#if guessState === 'correct' || guessState === 'wrong'}
        <div>Target: {target?.absolute}</div>
        <div class="ml-8">Played: {played?.absolute}</div>
      {:else if guessState === 'ended'}
        <div>
          <div>
            <span>Result: [{$currentGame.correct} / {$currentGame.notes.length}]</span>
            <span>avg {$currentGame.avgTime}s</span>
          </div>
          <div>
            <button class="btn primary" on:click={playGuessNotes}>Try Again</button>
            <button class="btn primary" on:click={clearGame}>Clear</button>
          </div>
        </div>
      {/if}
    </div>
  {:else}
    <div class="objective">
      {#if played}
        <div>Played: {played.absolute}</div>
      {/if}
    </div>
  {/if}
  {#if $useKeyboard}
    {#if keyboardError}
      <div>{keyboardError}</div>
    {:else if keyboardInput}
      <div>Input: {keyboardInput}</div>
    {/if}
  {/if}
</section>

<style lang="scss">
  .objective {
    display: flex;
  }
</style>
