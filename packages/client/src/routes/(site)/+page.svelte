<script lang="ts">
  import restore from '@iconify-icons/mdi/restore'
  import { onMount } from 'svelte'

  import Chords from '$components/Chords.svelte'
  import GameControls from '$components/play/GameControls.svelte'
  import IconButton from '$elements/IconButton.svelte'
  import IOSettings from '$components/IOSettings.svelte'
  import KeyboardInput from '$components/KeyboardInput.svelte'
  import NavBar from '$components/NavBar.svelte'
  import PlayForm from '$components/play/PlayForm.svelte'
  import Scales from '$components/scales/Scales.svelte'
  import ScoreOptions from '$components/play/ScoreOptions.svelte'
  import VirtualPiano from '$components/virtual-piano/VirtualPiano.svelte'

  import { currentGame, gameActions, gameOptions, guessState } from '$stores/game'
  import {
    inputs,
    inputsActions,
    midiGranted,
    midiInput,
    piano,
    useVirtualPiano
  } from '$stores/inputs'
  import { modalActions } from '$stores/modal'
  import { scoreActions } from '$stores/score'
  import { reset } from '$stores/persist'

  import type { NoteMessageEvent } from 'webmidi'
  import { GuessChords, GuessKeys, GuessNotes } from '@/games'
  import { getRootNote } from '@/chords-and-scales'
  import { keyboardActions } from '$stores/keyboard'

  let timeout: ReturnType<typeof setTimeout> | undefined
  let chordTimeout: ReturnType<typeof setTimeout> | undefined

  onMount(() => {
    if ($midiGranted) {
      inputsActions.openMidi()
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
    if ('data' in input) {
      input.data.channels[1].addListener('noteon', noteOnListener)
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
      inputsActions.play(value, $inputs.fixedVelocity ?? velocity)
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
      scoreActions.setPlayed(game.latestGuess.guessed?.notes || [], correct, -1)
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
  function handleNote(e: CustomEvent<{ note: string; octave: number }>) {
    const found = keyboardActions.findNote(e.detail.note) ?? getRootNote(e.detail.note)
    if (found) {
      handlePlayedNote(found.semitones + 12 + e.detail.octave * 12, 80)
    }
  }
  function handleReset() {
    reset()
    window.location.reload()
  }
</script>

<NavBar />

<h1
  class="mt-12 mb-4 md:mt-16 px-4 text-4xl md:text-5xl font-bold tracking-tight flex items-center justify-between"
>
  MIDI Note Trainer
  <div class="flex items-center justify-center">
    <IconButton class="p-2" icon={restore} size={24} on:click={handleReset} />
  </div>
</h1>

<div class="px-4 mb-8 md:mb-10">
  <button
    class="btn-pill border-2 border-gray-300 hover:bg-gray-200"
    on:click={() => modalActions.open('introduction', undefined)}>Introduction</button
  >
</div>

<section class="px-4">
  <IOSettings />
  <Scales />
  <Chords />
  <div class="play">
    <ScoreOptions class="score-options mr-4" />
    <PlayForm class="play-form" />
  </div>
</section>

{#await import('$components/score/Score.svelte')}
  &nbsp;
{:then { default: comp }}
  <svelte:component this={comp} class="px-4" />
{/await}

<section class="mb-8 ml-16 flex flex-col">
  <KeyboardInput
    debounced={!!timeout}
    on:guessed-chord={handleGuessedChord}
    on:guessed-key={handleGuessedKey}
    on:guessed-note={handleNote}
  />
  <GameControls game={$currentGame} />
</section>

{#if $useVirtualPiano}
  <VirtualPiano height={160} on:pressed={e => handlePlayedNote(e.detail, 80)} />
{/if}

<style lang="scss">
  .play {
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: auto;
    @media (width <= 656px) {
      @apply flex flex-col;
      :global(.score-options) {
        @apply w-full;
      }
      :global(.play-form) {
        @apply mt-4;
      }
    }
  }
</style>
