<script lang="ts">
  import Checkbox from '$elements/Checkbox.svelte'

  import { gameActions, gameOptions } from '$stores/game'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLElement> {}

  let props: Props = $props()
  let count = $state(($gameOptions.count || 0).toString())
  let waitSeconds = $state(($gameOptions.waitSeconds || 0).toString())

  gameOptions.subscribe(v => {
    count = v.count.toString()
    waitSeconds = v.waitSeconds.toString()
  })

  function handleCountChanged(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    let int
    try {
      int = parseInt(e.currentTarget.value)
      if (int <= 0 || isNaN(int)) {
        int = 1
      }
      gameActions.setOptionValue('count', int)
      e.currentTarget.blur()
    } catch (err) {
      count = $gameOptions.count.toString()
    }
  }
  function handleWaitChanged(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    let n
    try {
      n = parseFloat(e.currentTarget.value)
      if (n < 0 || isNaN(n)) {
        n = 0
      }
      gameActions.setOptionValue('waitSeconds', n)
      e.currentTarget.blur()
    } catch (err) {
      waitSeconds = $gameOptions.waitSeconds.toString()
    }
  }
</script>

<ul {...props} class={`${props.class || ''}`}>
  <li class="flex items-center justify-between">
    <label class="font-bold" for="guess-count">Count</label>
    <input
      class="h-[20px] w-10"
      id="guess-count"
      type="number"
      bind:value={count}
      onchange={handleCountChanged}
    />
  </li>
  <li class="mr-6 flex items-center items-center justify-between">
    <label class="font-bold" for="duplicates">Duplicates</label>
    <Checkbox
      id="duplicates"
      checked={$gameOptions.duplicates}
      oninput={e => gameActions.setOptionValue('duplicates', e.currentTarget.checked)}
    />
  </li>
  <li class="mr-6 flex items-center items-center justify-between">
    <label class="font-bold" for="autoplay">Autoplay</label>
    <Checkbox
      id="autoplay"
      checked={$gameOptions.autoplay}
      oninput={e => gameActions.setOptionValue('autoplay', e.currentTarget.checked)}
    />
  </li>
  <li class="flex items-center justify-between">
    <label class="font-bold" for="wait-ms">Wait seconds</label>
    <input
      class="h-[20px] w-10"
      id="wait-ms"
      type="number"
      step="0.5"
      bind:value={waitSeconds}
      onchange={handleWaitChanged}
    />
  </li>
</ul>

<style lang="postcss">
  @reference "#app.pcss";

  ul {
    li + li {
      @apply mt-1;
    }
    .selected {
      @apply bg-gray-200;
    }
  }
</style>
