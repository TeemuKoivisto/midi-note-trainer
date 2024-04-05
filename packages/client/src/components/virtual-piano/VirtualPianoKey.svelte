<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let key: { idx: number; isWhite: boolean; whiteKeyCount: number }

  let keyHeld = false
  let timeout: ReturnType<typeof setTimeout> | undefined

  const dispatch = createEventDispatcher<{
    pressed: number
  }>()
  const WHITE_WIDTH = 36
  const BLACK_WIDTH = 24

  $: isWhite = key.isWhite
  $: whiteCount = key.whiteKeyCount - 1
  $: left = isWhite ? whiteCount * WHITE_WIDTH : (whiteCount + 1) * WHITE_WIDTH - 12
  $: height = isWhite ? '100%' : '66%'
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
  class={`${$$props.class || ''} absolute `}
  style="left: {left}px; height: {height}; width: {width}px; z-index: {zIndex};"
>
  <button
    class="relative w-full h-full shadow bg-[#ececf1] rounded flex justify-center"
    class:white-key={isWhite}
    class:black-key={!isWhite}
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
      border: 2px solid transparent;
      @apply shadow outline-none;
      &.white-key:active {
        background: #f4f3f3;
        box-shadow:
          inset 3px 2px 3px #999,
          inset -3px 2px 3px #999;
      }
      &.black-key {
        background-color: black;
        &:active {
          background: #222;
          box-shadow:
            1px 1px 0 #555,
            2px 2px 0 #555;
        }
      }
    }
  }
</style>
