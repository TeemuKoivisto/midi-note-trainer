<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { currentGame } from '$stores/game'
  import { inputs, midiRangeNotes } from '$stores/inputs'
  import { hotKeyMap } from '$stores/score'
  import { parseNote } from '$utils/getNote'

  import { GuessKeys } from '$utils/guess_keys'

  export let debounced: boolean

  const dispatch = createEventDispatcher<{ 'guessed-key': string; note: number }>()

  const regexPosInt = /^[0-9]$/
  let keyboardError = ''
  let keyboardInput = ''

  function handleKeyDown(e: KeyboardEvent) {
    const game = $currentGame
    if (game instanceof GuessKeys && !debounced) {
      const pressed = e.key.toUpperCase()
      const keymap = $hotKeyMap
      if (keyboardInput.length === 0 && pressed in keymap) {
        const value = keymap[pressed as keyof typeof keymap].defaultNote
        dispatch('guessed-key', value)
      } else if (e.key === 'Backspace' && keyboardInput.length > 0) {
        keyboardInput = keyboardInput.slice(0, -1)
      }
    } else if ($inputs.useKeyboard && !debounced) {
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
        const note = parseNote(keyboardInput + (octave ?? pressed))
        if ('data' in note) {
          dispatch('note', note.data)
        } else {
          keyboardError = `Error: ${note.err}`
        }
        keyboardInput = ''
      } else if (e.key === 'Backspace' && keyboardInput.length > 0) {
        keyboardInput = keyboardInput.slice(0, -1)
      }
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class={`${$$props.class || ''}`}>
  {#if $inputs.useKeyboard && keyboardError}
    {keyboardError}
  {:else if $inputs.useKeyboard && keyboardInput}
    Input: {keyboardInput}
  {:else}
    &nbsp;
  {/if}
</div>

<style lang="scss">
</style>
