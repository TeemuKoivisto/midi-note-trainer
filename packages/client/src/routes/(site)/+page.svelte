<script lang="ts">
  import { onMount } from 'svelte'

  import Chords from '$components/Chords.svelte'
  import GameKeys from '$components/GameKeys.svelte'
  import GameNotes from '$components/GameNotes.svelte'
  import Inputs from '$components/Inputs.svelte'
  import Options from '$components/Options.svelte'
  import PlayForm from '$components/PlayForm.svelte'
  import Score from '$components/Score.svelte'

  import { currentGame, gameActions } from '$stores/game'
  import { inputs, midiActions, midiInput, midiRangeNotes, piano } from '$stores/inputs'
  import { hotKeyMap, played, scoreActions } from '$stores/score'
  import { getNote, parseNote } from '$utils/getNote'

  import type { NoteMessageEvent } from 'webmidi'
  import { GuessNotes } from '$utils/guess_notes'
  import { GuessKeys } from '$utils/guess_keys'

  let status = 'Finding device...'

  let timeout: ReturnType<typeof setTimeout> | undefined

  const regexNote = /^[AWSDEFRGTHJU]$/
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
  function handleKeyDown(e: KeyboardEvent) {
    const game = $currentGame
    if (game instanceof GuessKeys && !timeout) {
      const pressed = e.key.toUpperCase()
      const keymap = $hotKeyMap
      if (keyboardInput.length === 0 && pressed in keymap) {
        const value = keymap[pressed as keyof typeof keymap].defaultNote
        let correct
        if (game.type === 'minor') {
          correct = game.guess(value + 'm')
        } else {
          correct = game.guess(value)
        }
        gameActions.updateState(correct ? 'correct' : 'wrong')
        timeout = setTimeout(() => {
          if (game.ended) {
            gameActions.updateState('ended')
          } else {
            scoreActions.setKey(game.current)
            gameActions.updateState('waiting')
          }
          timeout = undefined
        }, 2000)
      } else if (e.key === 'Backspace' && keyboardInput.length > 0) {
        keyboardInput = keyboardInput.slice(0, -1)
      }
    } else if ($inputs.useKeyboard && !timeout) {
      const pressed = e.key.toUpperCase()
      const keymap = $hotKeyMap
      let octave
      if (keyboardInput.length === 0 && pressed in keymap) {
        const key = keymap[pressed as keyof typeof keymap]
        keyboardInput = key.defaultNote
        keyboardError = ''
        if ($inputs.useAutoOctave) {
          octave = $midiRangeNotes[0].octave + Math.floor(key.order / 12)
        }
      }
      if ((keyboardInput.length > 0 && regexPosInt.test(pressed)) || octave !== undefined) {
        // Octave pressed
        const note = parseNote(keyboardInput + octave ?? pressed)
        if ('data' in note) {
          handlePlayedNote(note.data, 120)
        } else {
          keyboardError = `Error: ${note.err}`
        }
        keyboardInput = ''
      } else if (e.key === 'Backspace' && keyboardInput.length > 0) {
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
</script>

<svelte:window on:keydown={handleKeyDown} />

<h1 class="my-8 md:text-5xl mt-12 px-4 md:px-0 text-3xl font-cursive tracking-tight">
  <a class="hover:underline" href="https://github.com/TeemuKoivisto/midi-music-notation-trainer">
    MIDI Music Notation Trainer
  </a>
</h1>

<section class="px-4 md:px-0">
  <Inputs />
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
  {:else if $played.length > 0}
    <div class="min-h-32">Played: {$played[0].absolute}</div>
  {:else}
    <div class="min-h-32">&nbsp;</div>
  {/if}
  <div class="min-h-32">
    {#if $inputs.useKeyboard && keyboardError}
      {keyboardError}
    {:else if $inputs.useKeyboard && keyboardInput}
      Input: {keyboardInput}
    {:else}
      &nbsp;
    {/if}
  </div>
</section>

<style lang="scss">
</style>
