<script lang="ts">
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
  <li class="flex items-center justify-between mr-6">
    <label class="font-bold" for="duplicates">Duplicates</label>
    <input
      class="h-[20px]"
      id="duplicates"
      type="checkbox"
      bind:checked={$gameOptions.duplicates}
    />
  </li>
  <li class="flex items-center justify-between mr-6">
    <label class="font-bold" for="autoplay">Autoplay</label>
    <input class="h-[20px]" id="autoplay" type="checkbox" bind:checked={$gameOptions.autoplay} />
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
