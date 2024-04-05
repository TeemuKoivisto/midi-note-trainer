<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let key: { idx: number; isWhite: boolean; whiteKeyCount: number },
    row: number,
    keyCount: number,
    isFirst: boolean,
    isLast: boolean,
    pianoWidth: number

  let keyHeld = false
  let timeout: ReturnType<typeof setTimeout> | undefined

  const dispatch = createEventDispatcher<{
    pressed: number
  }>()

  $: isWhite = key.isWhite
  $: whiteCount = key.whiteKeyCount - 1
  $: whiteWidth = (pianoWidth - 12) / 7
  $: blackWidth = ((pianoWidth - 12) / 7) * 0.75
  $: left = isWhite
    ? 6 + whiteCount * whiteWidth
    : 6 + (whiteCount + 1) * whiteWidth - blackWidth / 2
  $: height = isWhite
    ? `calc(100% - ${keyHeld ? '10px' : '6px'})`
    : `calc(66% - ${keyHeld ? '8px' : '4px'})`
  $: width = isWhite ? whiteWidth : blackWidth
  $: zIndex = isWhite ? 0 : 1

  function handlePointerDown(e: any) {
    if (!keyHeld && !timeout) {
      dispatch('pressed', key.idx + row * 12)
      keyHeld = true
    }
  }
  function handlePointerUp(e: any) {
    keyHeld = false
    timeout = setTimeout(() => {
      timeout = undefined
    }, 20)
  }
</script>

<li
  class={`${$$props.class || ''} absolute`}
  style="left: {left}px; height: {height}; width: {width}px; z-index: {zIndex};"
>
  <button
    class="relative w-full h-full shadow bg-white border border-gray-600 flex justify-center"
    class:is-first={isFirst}
    class:is-last={isLast}
    class:white-key={isWhite}
    class:black-key={!isWhite}
    class:is-held={keyHeld}
    on:mousedown={handlePointerDown}
    on:mouseup={handlePointerUp}
    on:touchstart={handlePointerDown}
    on:touchend={handlePointerUp}
  >
  </button>
</li>

<style lang="scss">
  li {
    button {
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      @apply relative shadow outline-none rounded-b top-0;
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
