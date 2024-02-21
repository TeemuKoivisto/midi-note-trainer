<script lang="ts">
  import { onMount } from 'svelte'

  import Chords from '$components/Chords.svelte'
  import GameChords from '$components/play/GameChords.svelte'
  import GameKeys from '$components/play/GameKeys.svelte'
  import GameNotes from '$components/play/GameNotes.svelte'
  import IOSettings from '$components/IOSettings.svelte'
  import KeyboardInput from '$components/KeyboardInput.svelte'
  import PlayChords from '$components/play/PlayChords.svelte'
  import PlayForm from '$components/play/PlayForm.svelte'
  import Scales from '$components/scales/Scales.svelte'
  import Score from '$components/Score.svelte'

  import { playNextTimeoutMs, currentGame, gameActions } from '$stores/game'
  import { inputs, inputsActions, midiGranted, midiInput, piano } from '$stores/inputs'
  import { played, scoreActions } from '$stores/score'
  import { getNoteAbsolute } from '$utils/getNote'

  import type { NoteMessageEvent } from 'webmidi'
  import { GuessNotes } from '$games/GuessNotes'
  import { GuessKeys } from '$games/GuessKeys'
  import { GuessChords } from '$games/GuessChords'
  import { PlayChordsGame } from '$games/PlayChords'

  let status = 'Finding device...'

  let timeout: ReturnType<typeof setTimeout> | undefined
  let chordTimeout: ReturnType<typeof setTimeout> | undefined

  onMount(() => {
    if ($midiGranted) {
      handlePromptMIDI()
    }
    window.addEventListener('keydown', initAudio)
    window.addEventListener('mousedown', initAudio)
    window.addEventListener('touchstart', initAudio)
    return () => {
      window.removeEventListener('keydown', initAudio)
      window.removeEventListener('mousedown', initAudio)
      window.removeEventListener('touchstart', initAudio)
    }
  })

  midiInput.subscribe(input => {
    if (input) {
      input.channels[1].addListener('noteon', noteOnListener)
    }
  })

  /**
   * Initializes audio on user interaction as auto-play is not allowed
   */
  function initAudio() {
    inputsActions.initAudio()
    window.removeEventListener('keydown', initAudio)
    window.removeEventListener('mousedown', initAudio)
    window.removeEventListener('touchstart', initAudio)
  }
  function noteOnListener(e: NoteMessageEvent) {
    if (timeout) return
    // console.log('noteon', e)
    // @ts-ignore
    const data = e.rawData as [number, number, number]
    handlePlayedNote(data[1], data[2])
  }
  function handlePlayedNote(value: number, velocity: number) {
    const game = $currentGame
    if (game instanceof GuessNotes && !game?.ended) {
      scoreActions.setTarget([scoreActions.getNote(game.current)])
      const correct = game.guess(value)
      gameActions.updateState(correct ? 'correct' : 'wrong')
      scoreActions.pushPlayed(value, correct, 2000)
      timeout = setTimeout(() => {
        if (game?.ended) {
          scoreActions.setTarget()
          gameActions.updateState('ended')
        } else if (game) {
          gameActions.updateState('waiting')
          game.startTime()
          if (game.type === 'notes') {
            scoreActions.setTarget([scoreActions.getNote(game.current)])
            $piano?.noteOn(game.current)
          } else {
            scoreActions.setTarget()
            $piano?.noteOn(game.current)
          }
        }
        scoreActions.clearPlayed()
        timeout = undefined
      }, 2000)
    } else if (game instanceof PlayChordsGame && !game?.ended) {
      game.addPlayedNote(value)
      if (!chordTimeout) chordTimeout = setTimeout(flushPlayedChords, 2000)
    } else {
      scoreActions.pushPlayed(value)
    }
    if ($piano) {
      $piano.noteOn(value, $inputs.fixedVelocity ?? velocity)
    }
  }
  function gameUpdate() {
    if ($playNextTimeoutMs >= 0) {
      timeout = setTimeout(() => {
        if ($playNextTimeoutMs >= 0) {
          gameActions.nextGuess()
        }
        timeout = undefined
      }, $playNextTimeoutMs)
    } else {
      timeout = undefined
    }
  }
  function flushPlayedChords() {
    const game = $currentGame
    if (game instanceof PlayChordsGame) {
      const correct = game.guess()
      scoreActions.setPlayed(game.latestGuess.notes, correct, 5000)
      gameActions.updateState(correct ? 'correct' : 'wrong')
      gameUpdate()
    }
    chordTimeout = undefined
  }
  function handleGuessedChord(
    e: CustomEvent<{ note: string; flats: number; sharps: number; chord: string }>
  ) {
    const game = $currentGame
    if (!(game instanceof GuessChords)) return
    const correct = game.guess(e.detail)
    gameActions.updateState(correct ? 'correct' : 'wrong')
    gameUpdate()
  }
  function handleGuessedKey(e: CustomEvent<string>) {
    const game = $currentGame
    if (!(game instanceof GuessKeys)) return
    let correct
    const note = e.detail.replaceAll('♭', 'b').replaceAll('♯', '#')
    if (game.type === 'minor') {
      correct = game.guess(note + 'm')
    } else {
      correct = game.guess(note)
    }
    gameActions.updateState(correct ? 'correct' : 'wrong')
    gameUpdate()
  }
  function handleNote(e: CustomEvent<number>) {
    handlePlayedNote(e.detail, 80)
  }
  async function handlePromptMIDI() {
    status = 'Finding device...'
    const res = await inputsActions.openMidi()
    if ('data' in res) {
      status = res.data.name
    } else {
      status = res.err
      console.error(res.err)
    }
  }
</script>

<svelte:head>
  <meta name="description" content="App to practise music notation, scales and chords using MIDI" />
</svelte:head>

<h1 class="my-8 md:text-5xl mt-12 px-4 md:px-0 text-3xl font-cursive tracking-tight">
  <a class="hover:underline" href="https://github.com/TeemuKoivisto/midi-note-trainer">
    MIDI Note Trainer
  </a>
</h1>

<section class="px-4 md:px-0">
  <IOSettings />
  <Scales />
  <Chords />
  <PlayForm />
</section>

<Score class="px-4 md:px-0" />

<section class="mb-8 px-4 md:px-0">
  {#if $currentGame instanceof GuessKeys}
    <GameKeys game={$currentGame} />
  {:else if $currentGame instanceof GuessNotes}
    <GameNotes class="min-h-32" game={$currentGame} />
  {:else if $currentGame instanceof GuessChords}
    <GameChords class="min-h-32" game={$currentGame} />
  {:else if $currentGame instanceof PlayChordsGame}
    <PlayChords class="min-h-32" game={$currentGame} />
  {:else if $played.length > 0}
    <div class="min-h-32">
      <span>Played: </span>
      {#each $played as note}
        <span class="mx-1">{getNoteAbsolute(note)}</span>
      {/each}
    </div>
  {:else}
    <div class="min-h-32">&nbsp;</div>
  {/if}
  <KeyboardInput
    class="min-h-32"
    debounced={!!timeout}
    on:guessed-chord={handleGuessedChord}
    on:guessed-key={handleGuessedKey}
    on:note={handleNote}
  />
</section>

<style lang="scss">
</style>
