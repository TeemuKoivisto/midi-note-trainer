<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import arrowRight from '@iconify-icons/mdi/arrow-right-bold'
  import { isTabletOrPhone } from '$stores/media'

  import { currentGame, guessState } from '$stores/game'
  import { inputs } from '$stores/inputs'
  import { keyboardActions } from '$stores/keyboard'
  import { KeyboardInputState } from '$stores/keyboard/KeyboardInputState'

  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    debounced: boolean
    state: KeyboardInputState
  }

  let { debounced, state, ...rest }: Props = $props()

  // @TODO this error is not used
  let keyboardError = ''
  let keyboardInput = $derived(state.keyboardInput)
  let inputtedNote = $derived(state.inputtedNote)

  function handleWindowKeyDown(e: KeyboardEvent) {
    const target = e.target
    if (debounced || !(target instanceof HTMLElement) || target.tagName === 'INPUT') return
    handleKeyDown(e)
    state.addPressedKey(e.code)
  }
  function handleKeyDown(e: KeyboardEvent) {
    const parsed = keyboardActions.handleInput(e.code, e.key, e.shiftKey)
    if (parsed && parsed.e === 'note') {
      state.handlePressedNote(parsed.data)
    } else if (parsed && parsed.e === 'string') {
      state.handleInput(parsed.data)
    } else if (
      parsed &&
      !state.pressedKeys.has(e.code) &&
      (parsed.e === 'guessed-key' || parsed.e === 'guessed-chord' || parsed.e === 'guessed-note')
    ) {
      state.submit(parsed)
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
    state.deletePressedKey(e.code)
  }
  function handleInput(
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement
    }
  ) {
    e.preventDefault()
    if (e instanceof InputEvent && e.inputType === 'insertText') {
      handleKeyDown(new KeyboardEvent('down', { key: e.data ?? '' }))
    } else if (e instanceof InputEvent && e.inputType === 'deleteContentBackward') {
      handleKeyDown(new KeyboardEvent('down', { code: `Backspace` }))
    }
  }
  function handleChange(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    e.preventDefault()
    // handleKeyDown(new KeyboardEvent('down', { code: 'Enter' }))
  }
  function handleInputSubmit() {
    handleKeyDown(new KeyboardEvent('down', { code: 'Enter' }))
  }
</script>

<svelte:window on:keydown={handleWindowKeyDown} on:keyup={handleKeyUp} />

<div {...rest} class={`${rest.class || ''} min-h-[32px]`}>
  {#if $isTabletOrPhone && $currentGame?.type === 'chords-write' && $guessState === 'waiting'}
    <div
      class="relative flex w-48 items-center rounded border border-gray-400 bg-gray-100 focus-within:ring-2 focus-within:ring-blue-500"
    >
      <input
        id="mobile-input"
        class="w-full rounded bg-transparent px-1 py-[3px] outline-none"
        value={$keyboardInput}
        autocomplete="off"
        oninput={handleInput}
        onchange={handleChange}
      />
      <button class="rounded-r px-1 py-[3px] hover:bg-gray-300" onclick={handleInputSubmit}>
        <Icon icon={arrowRight} width={24} />
      </button>
    </div>
  {:else if $inputs.useKeyboard && keyboardError}
    {keyboardError}
  {:else if $inputs.useKeyboard && $keyboardInput}
    Input: {$keyboardInput}
  {:else if $inputs.useKeyboard && $inputtedNote}
    Input: {$inputtedNote.note}
  {:else}
    &nbsp;
  {/if}
</div>

<style lang="postcss">
</style>
