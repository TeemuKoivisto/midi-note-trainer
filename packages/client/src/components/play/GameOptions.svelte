<script lang="ts">
  import Checkbox from '$elements/Checkbox.svelte'

  import { gameActions, gameOptions } from '$stores/game'

  let count = $gameOptions.count || ''
  let waitSeconds = $gameOptions.waitSeconds || ''

  gameOptions.subscribe(v => {
    count = v.count || ''
    waitSeconds = v.waitSeconds || ''
  })

  function handleCountChanged({
    currentTarget: { value }
  }: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    let int
    try {
      int = parseInt(value)
      if (int <= 0) {
        int = 1
      }
      gameActions.setOptionValue('count', int)
    } catch (err) {
      count = $gameOptions.count
    }
  }
  function handleWaitChanged({
    currentTarget: { value }
  }: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    let int
    try {
      int = parseInt(value)
      if (int < 0) {
        int = 0
      }
      gameActions.setOptionValue('waitSeconds', int)
    } catch (err) {
      waitSeconds = $gameOptions.waitSeconds
    }
  }
</script>

<ul class={`${$$props.class || ''}`}>
  <li class="flex items-center justify-between">
    <label class="font-bold" for="guess-count">Count</label>
    <input
      class="h-[20px] w-10"
      id="guess-count"
      type="number"
      bind:value={count}
      on:input={handleCountChanged}
    />
  </li>
  <li class="flex items-center justify-between items-center mr-6">
    <label class="font-bold" for="duplicates">Duplicates</label>
    <Checkbox
      id="duplicates"
      checked={$gameOptions.duplicates}
      on:input={e => gameActions.setOptionValue('duplicates', e.currentTarget.checked)}
    />
  </li>
  <li class="flex items-center justify-between items-center mr-6">
    <label class="font-bold" for="autoplay">Autoplay</label>
    <Checkbox
      id="autoplay"
      checked={$gameOptions.autoplay}
      on:input={e => gameActions.setOptionValue('autoplay', e.currentTarget.checked)}
    />
  </li>
  <li class="flex items-center justify-between">
    <label class="font-bold" for="wait-ms">Wait seconds</label>
    <input
      class="h-[20px] w-10"
      id="wait-ms"
      type="number"
      bind:value={waitSeconds}
      on:input={handleWaitChanged}
    />
  </li>
</ul>

<style lang="scss">
  ul {
    li + li {
      @apply mt-1;
    }
    .selected {
      @apply bg-gray-200;
    }
  }
</style>
