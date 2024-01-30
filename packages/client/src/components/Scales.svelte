<script lang="ts">
  import { writable } from 'svelte/store'
  import { scales } from '@/chords-and-scales'

  import { persist } from '$stores/persist'

  $: scalesList = Array.from(scales.entries())
  $: leftList = scalesList.filter((_, i) => i < scalesList.length / 2)
  $: rightList = scalesList.filter((_, i) => i >= scalesList.length / 2)

  const hidden = persist(writable(false), { key: 'scales-hidden' })

  function toggleVisibility() {
    hidden.update(h => !h)
  }
</script>

<div class={`${$$props.class || ''}`}>
  <fieldset class="flex flex-col rounded border-2 px-4 py-2 my-4 text-sm" class:collapsed={$hidden}>
    <legend class="px-2 text-0A text-base">
      <button class="hover:bg-gray-100" on:click={toggleVisibility}>Scales</button>
    </legend>
    <div class="flex flex-col md:flex-row" class:hidden={$hidden}>
      <ul class="list w-full mr-1 md:w-1/2">
        {#each leftList as scale}
          <div class="intervals">
            {#each scale[1].intervals as interval}
              <span>{interval.str}</span>
            {/each}
          </div>
          <div class="text-xs">{scale[1].name}</div>
        {/each}
      </ul>
      <ul class="list w-full mt-2 md:mt-0 md:w-1/2">
        {#each rightList as scale}
          <div class="intervals">
            {#each scale[1].intervals as interval}
              <span>{interval.str}</span>
            {/each}
          </div>
          <div class="text-xs">{scale[1].name}</div>
        {/each}
      </ul>
    </div>
  </fieldset>
</div>

<style lang="scss">
  .collapsed {
    @apply py-0.5;
  }
  .hidden {
    display: none;
  }
  .list {
    display: grid;
    gap: 0.25rem;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    align-items: center;
  }
  .intervals {
    & > span + span::before {
      content: '-';
      @apply text-xs mx-[1px];
    }
  }
  .error {
    @apply text-xs text-red-500;
  }
</style>
