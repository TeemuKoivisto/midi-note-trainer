<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLLIElement> {
    key: { idx: number; isWhite: boolean; whiteKeyCount: number }
    row: number
    keyCount: number
    isFirst: boolean
    isLast: boolean
    pianoWidth: number
  }

  let { key, row, keyCount, isFirst, isLast, pianoWidth, ...rest }: Props = $props()

  type Mouse = MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }
  type Touch = TouchEvent & { currentTarget: EventTarget & HTMLButtonElement }

  let keyHeld = $state(false)
  let timeout = $state<ReturnType<typeof setTimeout> | undefined>()

  const dispatch = createEventDispatcher<{
    pressed: { idx: number; row: number }
  }>()

  let isWhite = $derived(key.isWhite)
  let whiteCount = $derived(key.whiteKeyCount - 1)
  let whiteWidth = $derived((pianoWidth - 12) / 7)
  let blackWidth = $derived(((pianoWidth - 12) / 7) * 0.75)
  let left = $derived(
    isWhite ? 6 + whiteCount * whiteWidth : 6 + (whiteCount + 1) * whiteWidth - blackWidth / 2
  )
  let height = $derived(
    isWhite ? `calc(100% - ${keyHeld ? '10px' : '6px'})` : `calc(66% - ${keyHeld ? '8px' : '4px'})`
  )
  let width = $derived(isWhite ? whiteWidth : blackWidth)
  let zIndex = $derived(isWhite ? 0 : 1)

  function handlePointerDown(_e: Mouse | Touch) {
    if (!keyHeld && !timeout) {
      dispatch('pressed', { idx: key.idx, row })
      keyHeld = true
    }
  }
  function handlePointerUp(_e: Mouse | Touch) {
    keyHeld = false
    timeout = setTimeout(() => {
      timeout = undefined
    }, 20)
  }
</script>

<li
  {...rest}
  class={`${rest.class || ''} absolute`}
  style="left: {left}px; height: {height}; width: {width}px; z-index: {zIndex};"
>
  <button
    class="relative flex h-full w-full justify-center border border-gray-600 bg-white shadow"
    class:is-first={isFirst}
    class:is-last={isLast}
    class:white-key={isWhite}
    class:black-key={!isWhite}
    class:is-held={keyHeld}
    onmousedown={handlePointerDown}
    onmouseup={handlePointerUp}
    onmouseleave={handlePointerUp}
    ontouchstart={handlePointerDown}
    ontouchend={handlePointerUp}
    aria-label="Piano key"
  ></button>
</li>

<style lang="postcss">
  @reference "#app.pcss";

  li {
    button {
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      @apply relative top-0 rounded-b shadow outline-none;
      &.is-first {
        @apply rounded-tl;
      }
      &.is-last {
        @apply rounded-tr;
      }
      /** Based on https://mczak.com/code/piano/ */
      &.white-key {
        background: linear-gradient(-30deg, #f8f8f8, #ffffff);
        box-shadow:
          inset 0 1px 0 #fff,
          inset 0 -1px 0 #fff,
          inset 1px 0 0 #fff,
          inset -1px 0 0 #fff,
          0 4px 3px rgba(0, 0, 0, 0.7),
          inset 0 -1px 0 #fff,
          inset 1px 0 0 #fff,
          inset -1px -1px 15px rgba(0, 0, 0, 0.5),
          -3px 4px 6px rgba(0, 0, 0, 0.5);
        &.is-held {
          box-shadow:
            inset 0 1px 0 #fff,
            inset 0 -1px 0 #fff,
            inset 1px 0 0 #fff,
            inset -1px 0 0 #fff,
            0 4px 3px rgba(0, 0, 0, 0.7),
            inset 0 -1px 0 #fff,
            inset 1px 0 0 #fff,
            inset -1px -1px 15px #000,
            -3px 4px 6px rgba(0, 0, 0, 0.5);
        }
      }
      &.black-key {
        background: linear-gradient(-20deg, #222222, #000000, #222222);
        border-width: 1px 3px 8px;
        border-style: solid;
        border-color: #666 #222 #111 #555;
        box-shadow:
          inset 0 -1px 2px rgba(255, 255, 255, 0.4),
          0 2px 3px rgba(0, 0, 0, 0.4);
        &.is-held {
          border-bottom-width: 3px;
          background: linear-gradient(-20deg, #444, #222, #444);
        }
      }
    }
  }
</style>
