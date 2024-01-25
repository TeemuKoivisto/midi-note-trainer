<script lang="ts">
  import { onMount } from 'svelte'

  import GameInfo from '$components/GameInfo.svelte'
  import Inputs from '$components/Inputs.svelte'
  import Options from '$components/Options.svelte'
  import PlayForm from '$components/PlayForm.svelte'
  import Score from '$components/Score.svelte'

  import { currentGame, gameActions } from '$stores/game'
  import { useKeyboard, midiActions, midiInput, piano } from '$stores/midi'
  import { scoreActions } from '$stores/score'
  import { getNote, parseNote } from '$utils/midi'

  import type { NoteMessageEvent } from 'webmidi'

  const KEY_MAP = {
    A: { key: 'C', shift: 0 },
    W: { key: 'C♯', shift: 0 },
    S: { key: 'D', shift: 0 },
    D: { key: 'E', shift: 0 },
    E: { key: 'E♭', shift: 0 },
    F: { key: 'F', shift: 0 },
    R: { key: 'F♯', shift: 0 },
    G: { key: 'G', shift: 0 },
    T: { key: 'G♯', shift: 0 },
    H: { key: 'A', shift: 0 },
    J: { key: 'B', shift: 0 },
    U: { key: 'B♭', shift: 0 },
    K: { key: 'C', shift: 1 },
    O: { key: 'C♯', shift: 1 },
    L: { key: 'D', shift: 1 },
    Ö: { key: 'E', shift: 1 },
    P: { key: 'E♭', shift: 1 },
    Ä: { key: 'F', shift: 1 },
    Å: { key: 'F♯', shift: 1 }
  }

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
    scoreActions.pushPlayed(getNote(value))
    if ($currentGame) {
      scoreActions.setTarget(getNote($currentGame.current))
      const correct = $currentGame.guess(value)
      gameActions.updateState(correct ? 'correct' : 'wrong')
      timeout = setTimeout(() => {
        if ($currentGame?.ended) {
          scoreActions.setTarget()
          gameActions.updateState('ended')
        } else if ($currentGame) {
          gameActions.updateState('waiting')
          $currentGame.startTime()
          if ($currentGame.type === 'notes') {
            scoreActions.setTarget(getNote($currentGame.current))
            $piano?.noteOn($currentGame.current, 80)
          } else {
            scoreActions.setTarget()
            $piano?.noteOn($currentGame.current, 80)
          }
        }
        scoreActions.clearPlayed()
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
      if (keyboardInput.length === 0 && pressed in KEY_MAP) {
        keyboardInput = KEY_MAP[pressed as keyof typeof KEY_MAP].key
        keyboardError = ''
      } else if (keyboardInput.length > 0 && regexPosInt.test(pressed)) {
        // Octave pressed
        const note = parseNote(keyboardInput + pressed)
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
  MIDI Music Notation Trainer
</h1>

<section class="px-4 md:px-0">
  <Inputs />
  <Options />
  <PlayForm />
  <div id="output"></div>
</section>

<Score class="px-4 md:px-0" />

<section class="mb-8 px-4 md:px-0">
  <GameInfo class="min-h-32" />
  <div class="min-h-32">
    {#if $useKeyboard && keyboardError}
      {keyboardError}
    {:else if $useKeyboard && keyboardInput}
      Input: {keyboardInput}
    {:else}
      &nbsp;
    {/if}
  </div>
</section>

<style lang="scss">
</style>
