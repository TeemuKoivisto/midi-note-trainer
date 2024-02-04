<script lang="ts">
  import { onMount } from 'svelte'

  import Chords from '$components/Chords.svelte'
  import GameChords from '$components/GameChords.svelte'
  import GameKeys from '$components/GameKeys.svelte'
  import GameNotes from '$components/GameNotes.svelte'
  import IOSettings from '$components/IOSettings.svelte'
  import KeyboardInput from '$components/KeyboardInput.svelte'
  import PlayChords from '$components/PlayChords.svelte'
  import PlayForm from '$components/PlayForm.svelte'
  import Scales from '$components/Scales.svelte'
  import Score from '$components/Score.svelte'

  import { currentGame, gameActions } from '$stores/game'
  import { audioContext, inputsActions, midiGranted, midiInput, piano } from '$stores/inputs'
  import { played, scoreActions } from '$stores/score'
  import { addParts, getNote, getNoteAbsolute } from '$utils/getNote'

  import type { NoteMessageEvent } from 'webmidi'
  import { GuessNotes } from '$utils/guess_notes'
  import { GuessKeys } from '$utils/guess_keys'
  import { GuessChords } from '$utils/guess_chords'
  import { PlayChordsGame } from '$utils/play_chords'

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

  function initAudio() {
    inputsActions.initAudio()
    window.removeEventListener('keydown', initAudio)
    window.removeEventListener('mousedown', initAudio)
    window.removeEventListener('touchstart', initAudio)
  }
  function noteOnListener(e: NoteMessageEvent) {
    if (timeout) return
    console.log('noteon', e)
    // @ts-ignore
    const data = e.rawData as [number, number, number]
    handlePlayedNote(data[1], 80)
  }
  function handlePlayedNote(value: number, velocity: number) {
    const game = $currentGame
    if (game instanceof GuessNotes) {
      scoreActions.setTarget([getNote(game.current)])
      const correct = game.guess(value)
      gameActions.updateState(correct ? 'correct' : 'wrong')
      scoreActions.pushPlayed(getNote(value), 2000)
      timeout = setTimeout(() => {
        if (game?.ended) {
          scoreActions.setTarget()
          gameActions.updateState('ended')
        } else if (game) {
          gameActions.updateState('waiting')
          game.startTime()
          if (game.type === 'notes') {
            scoreActions.setTarget([getNote(game.current)])
            $piano?.noteOn(game.current)
          } else {
            scoreActions.setTarget()
            $piano?.noteOn(game.current)
          }
        }
        scoreActions.clearPlayed()
        timeout = undefined
      }, 2000)
    } else if (game instanceof PlayChordsGame) {
      game.addPlayedNote(value)
      if (!chordTimeout) chordTimeout = setTimeout(flushPlayedChords, 2000)
    } else {
      scoreActions.pushPlayed(getNote(value))
    }
    if ($piano) {
      $piano.noteOn(value, velocity)
    }
  }
  function gameUpdate() {
    const game = $currentGame
    if (game?.ended) {
      gameActions.updateState('ended')
    } else if (game instanceof GuessChords || game instanceof PlayChordsGame) {
      scoreActions.setTarget(game.current.notes.map(n => addParts(n)))
      $piano?.playChord(game?.current.notes.map(n => n.midi))
      gameActions.updateState('waiting')
    } else if (game instanceof GuessKeys) {
      scoreActions.setKey(game.current)
      gameActions.updateState('waiting')
    }
    timeout = undefined
  }
  function flushPlayedChords() {
    const game = $currentGame
    if (game instanceof PlayChordsGame) {
      const correct = game.guess()
      gameActions.updateState(correct ? 'correct' : 'wrong')
      timeout = setTimeout(gameUpdate, 5000)
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
    timeout = setTimeout(gameUpdate, 2000)
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
    timeout = setTimeout(gameUpdate, 2000)
  }
  function handleNote(e: CustomEvent<number>) {
    console.log('note', e.detail)
    handlePlayedNote(e.detail, 120)
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

<h1 class="my-8 md:text-5xl mt-12 px-4 md:px-0 text-3xl font-cursive tracking-tight">
  <a class="hover:underline" href="https://github.com/TeemuKoivisto/midi-music-notation-trainer">
    MIDI Music Notation Trainer
  </a>
</h1>

<section class="px-4 md:px-0">
  <IOSettings />
  <Scales />
  <Chords />
  <PlayForm />
  <div id="output"></div>
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
