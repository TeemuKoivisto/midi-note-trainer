<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { currentGame } from '$stores/game'
  import { inputs, keyboardFocused, midiRangeNotes } from '$stores/inputs'
  import { keyMap } from '$stores/score'
  import { getOctave } from '$utils/getNote'

  import { GuessKeys } from '$utils/guess_keys'
  import { GuessChords } from '$utils/guess_chords'

  export let debounced: boolean

  const dispatch = createEventDispatcher<{
    'guessed-key': string
    'guessed-chord': { note: string; flats: number; sharps: number; chord: string }
    note: number
  }>()

  const regexPosInt = /^[0-9]$/
  let keyboardError = ''
  let keyboardInput = ''
  let inputtedNote: { defaultNote: string; order: number } | undefined

  function parseNotes(e: KeyboardEvent) {
    const pressed = e.key.toUpperCase()
    const keymap = $keyMap
    let octave
    if (!inputtedNote && pressed in keymap) {
      const note = keymap[pressed as keyof typeof keymap]
      inputtedNote = note
      keyboardError = ''
      if ($inputs.useAutoOctave) {
        octave = getOctave($midiRangeNotes[0].midi)
      }
    }
    if (regexPosInt.test(pressed)) {
      try {
        octave = parseInt(pressed)
      } catch (err: any) {}
    }
    if (inputtedNote && octave !== undefined) {
      const midi = inputtedNote.order + (octave + 1 + (e.shiftKey ? 1 : 0)) * 12
      dispatch('note', midi)
      inputtedNote = undefined
    } else if (e.key === 'Backspace') {
      inputtedNote = undefined
    }
    keyboardInput = ''
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (debounced || !$keyboardFocused) return
    const game = $currentGame
    if (game instanceof GuessKeys) {
      const pressed = e.key.toUpperCase()
      const keymap = $keyMap
      if (keyboardInput.length === 0 && pressed in keymap) {
        const value = keymap[pressed as keyof typeof keymap].defaultNote
        dispatch('guessed-key', value)
        keyboardInput = ''
      } else if (e.key === 'Backspace') {
        keyboardInput = keyboardInput.slice(0, -1)
      }
    } else if (game instanceof GuessChords && game.type === 'write') {
      if (e.key === 'Enter' && keyboardInput.length > 0) {
        let value = { note: '', flats: 0, sharps: 0, chord: '' }
        for (let i = 0; i < keyboardInput.length; i += 1) {
          if (i === 0) {
            value.note += keyboardInput[i]
          } else if (value.chord.length > 0) {
            value.chord += keyboardInput[i]
          } else if (keyboardInput[i] === 'b' || keyboardInput[i] === '♭') {
            value.flats += 1
          } else if (keyboardInput[i] === '#' || keyboardInput[i] === '♯') {
            value.sharps += 1
          } else {
            value.chord += keyboardInput[i]
          }
        }
        dispatch('guessed-chord', value)
        keyboardInput = ''
      } else if (e.key === 'Backspace') {
        keyboardInput = keyboardInput.slice(0, -1)
      } else if (e.key.length === 1) {
        keyboardInput += e.key
        if (keyboardInput.length === 1) {
          keyboardInput = keyboardInput.toUpperCase()
        }
      }
    } else if ($inputs.useKeyboard) {
      parseNotes(e)
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class={`${$$props.class || ''}`}>
  {#if $inputs.useKeyboard && keyboardError}
    {keyboardError}
  {:else if $inputs.useKeyboard && keyboardInput}
    Input: {keyboardInput}
  {:else if $inputs.useKeyboard && inputtedNote}
    Input: {inputtedNote.defaultNote}
  {:else}
    &nbsp;
  {/if}
</div>

<style lang="scss">
</style>
