<script lang="ts">
  import { onMount } from 'svelte'

  import GameInfo from '$components/GameInfo.svelte'
  import MidiInfo from '$components/MidiInfo.svelte'
  import Score from '$components/Score.svelte'

  import { currentGame, gameActions } from '$stores/game'
  import { useKeyboard, midiActions, midiInput, piano } from '$stores/midi'
  import { getNote, parseNote } from '$utils/midi'
  import { createScale } from '@/music-scales'

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
    console.log(createScale('C#', 'major'))
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
    handlePlayedNote(data[1], 80)
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
          guessState = 'waiting'
          $currentGame.startTime()
          if ($currentGame.type === 'notes') {
            target = { ...getNote($currentGame.current), value: $currentGame.current }
          } else {
            target = undefined
            $piano?.noteOn($currentGame.current, 80)
          }
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
  function playGuessNotes(type: 'notes' | 'pitches') {
    if (type === 'notes') {
      guessState = 'waiting'
      const game = gameActions.playGuessNotes(type)
      const note = getNote(game.current)
      target = { ...note, value: game.current }
    } else if (type === 'pitches') {
      guessState = 'waiting'
      const game = gameActions.playGuessNotes(type)
      midiActions.setSound(true)
      $piano?.noteOn(game.current, 80)
    }
  }
  function tryAgain() {
    playGuessNotes($currentGame!.type)
  }
  function clearGame() {
    guessState = 'waiting'
    gameActions.clearGame()
    target = undefined
    played = undefined
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
      <button class="btn primary" on:click={() => playGuessNotes('notes')}>Guess 10 Notes</button>
      <button class="btn primary" on:click={() => playGuessNotes('pitches')}
        >Guess 10 Pitches</button
      >
      <button class="btn primary" on:click={clearGame}>Clear</button>
    </div>
  {/if}
</section>

<Score class="px-4 md:px-0" {target} {played} />

<section class="px-4 md:px-0">
  <GameInfo {target} {played} {guessState}>
    <div>
      <button class="btn primary" on:click={tryAgain}>Try Again</button>
      <button class="btn primary" on:click={clearGame}>Clear</button>
    </div>
  </GameInfo>
  {#if $useKeyboard}
    {#if keyboardError}
      <div>{keyboardError}</div>
    {:else if keyboardInput}
      <div>Input: {keyboardInput}</div>
    {/if}
  {/if}
</section>

<style lang="scss">
</style>
