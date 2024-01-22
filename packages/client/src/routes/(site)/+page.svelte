<script lang="ts">
  import { onMount } from 'svelte'

  import GameInfo from '$components/GameInfo.svelte'
  import MidiInfo from '$components/MidiInfo.svelte'
  import PlayForm from '$components/PlayForm.svelte'
  import Score from '$components/Score.svelte'

  import { currentGame, gameActions } from '$stores/game'
  import { useKeyboard, midiActions, midiInput, piano } from '$stores/midi'
  import { getNote, parseNote } from '$utils/midi'

  import type { NoteMessageEvent } from 'webmidi'

  let status = 'Finding device...'

  let timeout: ReturnType<typeof setTimeout> | undefined

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
    handlePlayedNote(data[1], 80)
  }
  function handlePlayedNote(value: number, velocity: number) {
    if (!$currentGame) {
      gameActions.setPlayed({ ...getNote(value), value, correct: false })
    } else {
      gameActions.setTarget({ ...getNote($currentGame.current), value: $currentGame.current })
      const correct = $currentGame.guess(value)
      gameActions.updateState(correct ? 'correct' : 'wrong')
      gameActions.setPlayed({ ...getNote(value), value, correct })
      timeout = setTimeout(() => {
        if ($currentGame?.ended) {
          gameActions.setTarget()
          gameActions.updateState('ended')
        } else if ($currentGame) {
          gameActions.updateState('waiting')
          $currentGame.startTime()
          if ($currentGame.type === 'notes') {
            gameActions.setTarget({ ...getNote($currentGame.current), value: $currentGame.current })
          } else {
            gameActions.setTarget()
            $piano?.noteOn($currentGame.current, 80)
          }
        }
        gameActions.setPlayed()
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
</script>

<svelte:window on:keydown={handleKeyDown} />

<h1 class="my-8 md:text-5xl mt-12 px-4 md:px-0 text-3xl font-cursive tracking-tight">
  MIDI Music Notation Trainer
</h1>

<section class="px-4 md:px-0">
  <MidiInfo />
  <PlayForm />
  <div id="output"></div>
</section>

<Score class="px-4 md:px-0" />

<section class="px-4 md:px-0">
  <GameInfo />
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
