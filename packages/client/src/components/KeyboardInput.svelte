<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import arrowRight from '@iconify-icons/mdi/arrow-right-bold'
  import { createEventDispatcher } from 'svelte'
  import { isTabletOrPhone } from '$stores/media'

  import { currentGame, guessState } from '$stores/game'
  import { inputs } from '$stores/inputs'
  import { keyboardActions } from '$stores/keyboard'

  import type { ScaleNote } from '@/chords-and-scales'

  export let debounced: boolean

  let keyboardError = ''
  let keyboardInput = ''
  let inputtedNote: ScaleNote | undefined
  const pressedKeys = new Set()

  const dispatch = createEventDispatcher<{
    'guessed-key': string
    'guessed-chord': { note: string; flats: number; sharps: number; chord: string }
    'guessed-note': { note: string; octave: number }
  }>()

  function handleWindowKeyDown(e: KeyboardEvent) {
    const target = e.target
    if (debounced || !(target instanceof HTMLElement) || target.tagName === 'INPUT') return
    handleKeyDown(e)
    pressedKeys.add(e.code)
  }
  function handleKeyDown(e: KeyboardEvent) {
    const parsed = keyboardActions.handleInput(e.code, e.key, e.shiftKey)
    if (parsed && parsed.e === 'note') {
      inputtedNote = parsed.data
    } else if (parsed && parsed.e === 'string') {
      keyboardInput = parsed.data
    } else if (
      parsed &&
      !pressedKeys.has(e.code) &&
      (parsed.e === 'guessed-key' || parsed.e === 'guessed-chord' || parsed.e === 'guessed-note')
    ) {
      keyboardInput = ''
      inputtedNote = undefined
      dispatch(parsed.e, parsed.data)
      if (e.code === 'Enter') {
        // If "Next" button is focused and hotkeys turned off, this would auto-click the button
        // and skip showing the guess
        e.preventDefault()
      }
    } else if (parsed) {
      // When inputting hotkeys, using Space scrolls the viewport downwards
      e.preventDefault()
    }
  }
  function handleKeyUp(e: KeyboardEvent) {
    pressedKeys.delete(e.code)
  }
  function handleInputSubmit() {
    handleKeyDown(new KeyboardEvent('down', { code: 'Enter', key: 'Enter', shiftKey: false }))
  }
</script>

<svelte:window on:keydown={handleWindowKeyDown} on:keyup={handleKeyUp} />

<div class={`${$$props.class || ''} min-h-[32px]`}>
  {#if $isTabletOrPhone && $currentGame?.type === 'chords-write' && $guessState === 'waiting'}
    <div
      class="w-48 flex items-center relative rounded border border-gray-400 bg-gray-100 focus-within:ring focus-within:ring-2 focus-within:ring-blue-500"
    >
      <input
        id="mobile-input"
        class="w-full px-1 py-[3px] bg-transparent rounded outline-none"
        value={keyboardInput}
        autocomplete="off"
        on:keydown|preventDefault={handleKeyDown}
      />
      <button class="px-1 py-[3px] rounded-r hover:bg-gray-300" on:click={handleInputSubmit}>
        <Icon icon={arrowRight} width={24} />
      </button>
    </div>
  {:else if $inputs.useKeyboard && keyboardError}
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
