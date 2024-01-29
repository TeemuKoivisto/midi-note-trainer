<script lang="ts">
  import { onMount } from 'svelte'

  import Chords from '$components/Chords.svelte'
  import GameChords from '$components/GameChords.svelte'
  import GameKeys from '$components/GameKeys.svelte'
  import GameNotes from '$components/GameNotes.svelte'
  import InputSettings from '$components/InputSettings.svelte'
  import KeyboardInput from '$components/KeyboardInput.svelte'
  import Options from '$components/Options.svelte'
  import PlayForm from '$components/PlayForm.svelte'
  import Score from '$components/Score.svelte'

  import { currentGame, gameActions } from '$stores/game'
  import { midiActions, midiInput, piano } from '$stores/inputs'
  import { played, scoreActions } from '$stores/score'
  import { getNote } from '$utils/getNote'

  import type { NoteMessageEvent } from 'webmidi'
  import { GuessNotes } from '$utils/guess_notes'
  import { GuessKeys } from '$utils/guess_keys'
  import { GuessChords } from '$utils/guess_chords'

  let status = 'Finding device...'

  let timeout: ReturnType<typeof setTimeout> | undefined

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
            $piano?.noteOn(game.current, 80)
          } else {
            scoreActions.setTarget()
            $piano?.noteOn(game.current, 80)
          }
        }
        scoreActions.clearPlayed()
        timeout = undefined
      }, 2000)
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
    } else if (game instanceof GuessChords) {
      scoreActions.setTarget(game.currentNotes)
      gameActions.updateState('waiting')
    } else if (game instanceof GuessKeys) {
      scoreActions.setKey(game.current)
      gameActions.updateState('waiting')
    }
    timeout = undefined
  }
  function handleGuessedChord(e: CustomEvent<string>) {
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
    handlePlayedNote(e.detail, 120)
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
</script>

<h1 class="my-8 md:text-5xl mt-12 px-4 md:px-0 text-3xl font-cursive tracking-tight">
  <a class="hover:underline" href="https://github.com/TeemuKoivisto/midi-music-notation-trainer">
    MIDI Music Notation Trainer
  </a>
</h1>

<section class="px-4 md:px-0">
  <InputSettings />
  <Options />
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
  {:else if $played.length > 0}
    <div class="min-h-32">Played: {$played[0].absolute}</div>
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
