<script lang="ts">
  import { onMount } from 'svelte'

  import Chords from '$components/Chords.svelte'
  import GameStats from '$components/play/GameStats.svelte'
  import IOSettings from '$components/IOSettings.svelte'
  import KeyboardInput from '$components/KeyboardInput.svelte'
  import PlayForm from '$components/play/PlayForm.svelte'
  import Scales from '$components/scales/Scales.svelte'
  import Score from '$components/Score.svelte'

  import { currentGame, gameActions, gameOptions, guessState } from '$stores/game'
  import { inputs, inputsActions, midiGranted, midiInput, piano } from '$stores/inputs'
  import { scoreActions } from '$stores/score'

  import type { NoteMessageEvent } from 'webmidi'
  import { GuessChords, GuessKeys, GuessNotes } from '@/games'

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
    if (game instanceof GuessNotes && !game?.ended && $guessState === 'waiting') {
      handleGuessedNote(value)
    } else if (game instanceof GuessChords && !game?.ended && $guessState === 'waiting') {
      game.addPlayedNote(value)
      if (!chordTimeout) chordTimeout = setTimeout(flushPlayedChords, 2000)
    } else if (!game) {
      scoreActions.pushPlayed(value)
    }
    if ($piano) {
      $piano.noteOn(value, $inputs.fixedVelocity ?? velocity)
    }
  }
  function gameUpdate() {
    if ($gameOptions.autoplay && $gameOptions.waitSeconds > 0) {
      timeout = setTimeout(() => {
        if ($gameOptions.autoplay) {
          gameActions.nextGuess()
        }
        timeout = undefined
      }, $gameOptions.waitSeconds * 1000)
    } else if ($gameOptions.autoplay) {
      gameActions.nextGuess()
    } else {
      timeout = undefined
    }
  }
  function flushPlayedChords() {
    const game = $currentGame
    if (game instanceof GuessChords) {
      const correct = game.guess()
      scoreActions.setPlayed(game.latestGuess.guessed?.notes || [], correct, 5000)
      gameActions.updateState(correct ? 'correct' : 'wrong')
      gameUpdate()
    }
    chordTimeout = undefined
  }
  function handleGuessedNote(value: number) {
    const game = $currentGame
    if (game instanceof GuessNotes && $guessState === 'waiting') {
      scoreActions.setTarget([scoreActions.getNote(game.current)])
      const correct = game.guess(value)
      gameActions.updateState(correct ? 'correct' : 'wrong')
      scoreActions.pushPlayed(value, correct, 4000)
      gameUpdate()
    }
  }
  function handleGuessedChord(
    e: CustomEvent<{ note: string; flats: number; sharps: number; chord: string }>
  ) {
    const game = $currentGame
    if (game instanceof GuessChords && $guessState === 'waiting') {
      const correct = game.guessWrittenChord(e.detail)
      gameActions.updateState(correct ? 'correct' : 'wrong')
      gameUpdate()
    }
  }
  function handleGuessedKey(e: CustomEvent<string>) {
    const game = $currentGame
    if (game instanceof GuessKeys && $guessState === 'waiting') {
      const note = e.detail.replaceAll('♭', 'b').replaceAll('♯', '#')
      const correct = game.guess(note)
      gameActions.updateState(correct ? 'correct' : 'wrong')
      gameUpdate()
    }
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
  <GameStats game={$currentGame} />
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
