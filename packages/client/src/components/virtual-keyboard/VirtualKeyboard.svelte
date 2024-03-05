<script lang="ts">
  import { onMount } from 'svelte'

  import VirtualKey from './VirtualKey.svelte'

  import { keyboard, keys, keyMap } from '$stores/keyboard'

  onMount(() => {
    console.log($keyMap)
  })

  let middleRow = true
  let twoRows = false
</script>

<div class={`${$$props.class || ''} `}>
  <div class="flex">
    <div class="my-1 flex items-center justify-between mr-12">
      <label class="font-bold mr-4" for="middle-row">Middle-row</label>
      <input class="h-[20px]" id="middle-row" type="checkbox" bind:checked={middleRow} />
    </div>
    <div class="my-1 flex items-center justify-between mr-12">
      <label class="font-bold mr-4" for="two-rows">Two rows</label>
      <input class="h-[20px]" id="two-rows" type="checkbox" bind:checked={twoRows} />
    </div>
  </div>
  <div class="flex flex-col gap-1.5">
    <ul class="keyboard">
      {#each $keys as row, ridx}
        <li class="col-span-2"></li>
        {#each row as vkey}
          <VirtualKey value={vkey} />
        {/each}
      {/each}
    </ul>
  </div>
</div>

<style lang="scss">
  ul {
    @apply h-48;
    li {
      @apply m-[0.175rem] shadow bg-[#ececf1] rounded flex items-center justify-center;
    }
  }
  .keyboard {
    display: grid;
    grid-template-columns: 2fr repeat(62, 1fr);
    grid-template-rows: auto;
  }
</style>
