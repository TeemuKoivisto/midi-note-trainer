<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { inputs } from '$stores/inputs'
  import { keyboardFocused, keyboardActions } from '$stores/keyboard'

  import type { ScaleNote } from '@/chords-and-scales'

  export let debounced: boolean

  let keyboardError = ''
  let keyboardInput = ''
  let inputtedNote: ScaleNote | undefined

  const dispatch = createEventDispatcher<{
    'guessed-key': string
    'guessed-chord': { note: string; flats: number; sharps: number; chord: string }
    'guessed-note': number
  }>()

  function handleKeyDown(e: KeyboardEvent) {
    if (debounced || !$keyboardFocused) return
    const parsed = keyboardActions.handleInput(e.code, e.key, e.shiftKey)
    if (parsed && parsed.e === 'note') {
      inputtedNote = parsed.data
    } else if (parsed && parsed.e === 'string') {
      keyboardInput = parsed.data
    } else if (parsed) {
      dispatch(parsed.e, parsed.data)
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
    Input: {inputtedNote.note}
  {:else}
    &nbsp;
  {/if}
</div>

<style lang="scss">
</style>
