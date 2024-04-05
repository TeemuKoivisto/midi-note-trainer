<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let key: { idx: number; isWhite: boolean; whiteKeyCount: number },
    isFirst: boolean,
    isLast: boolean

  let keyHeld = false
  let timeout: ReturnType<typeof setTimeout> | undefined

  const dispatch = createEventDispatcher<{
    pressed: number
  }>()
  const WHITE_WIDTH = 48
  const BLACK_WIDTH = 36

  $: isWhite = key.isWhite
  $: whiteCount = key.whiteKeyCount - 1
  $: left = isWhite ? 6 + whiteCount * WHITE_WIDTH : 6 + (whiteCount + 1) * WHITE_WIDTH - 18
  $: height = isWhite ? 'calc(100% - 6px)' : 'calc(66% - 6px)'
  $: width = isWhite ? WHITE_WIDTH : BLACK_WIDTH
  $: zIndex = isWhite ? 0 : 1

  function handlePointerDown(e: any) {
    if (!keyHeld && !timeout) {
      dispatch('pressed', key.idx)
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
      @apply shadow outline-none rounded-b;
      &.is-first {
        @apply rounded-tl;
      }
      &.is-last {
        @apply rounded-tr;
      }
      &.white-key.is-held {
        background: #f4f3f3;
        box-shadow:
          inset 3px 2px 3px #999,
          inset -3px 2px 3px #999;
      }
      &.black-key {
        background-color: black;
        &.is-held {
          background: #222;
          box-shadow:
            1px 1px 0 #555,
            2px 2px 0 #555;
        }
      }
    }
  }
</style>
