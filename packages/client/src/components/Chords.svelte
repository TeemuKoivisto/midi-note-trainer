<script lang="ts">
  import { writable } from 'svelte/store'
  import { chords } from '@/chords-and-scales'

  import { persist } from '$stores/persist'

  $: chordsList = Array.from(chords.entries())
  $: leftList = chordsList.filter((_, i) => i < chordsList.length / 2)
  $: rightList = chordsList.filter((_, i) => i >= chordsList.length / 2)

  const hidden = persist(writable(false), { key: 'chords-hidden' })

  function toggleVisibility() {
    hidden.update(h => !h)
  }
</script>

<div class={`${$$props.class || ''}`}>
  <fieldset class="flex flex-col rounded border-2 px-4 py-2 my-4 text-sm" class:collapsed={$hidden}>
    <legend class="px-2 text-0A text-base">
      <button class="hover:bg-gray-100" on:click={toggleVisibility}>Chords</button>
    </legend>
    <div class="flex flex-col md:flex-row" class:hidden={$hidden}>
      <ul class="chord-list w-full mr-1 md:w-1/2">
        {#each leftList as chord}
          <div class="flex items-center justify-center px-1 bg-gray-200">{chord[0]}</div>
          <div class="intervals">
            {#each chord[1].notes as interval}
              <span>{interval}</span>
            {/each}
          </div>
          <div class="text-xs">{chord[1].name}</div>
        {/each}
      </ul>
      <ul class="chord-list w-full mt-2 md:mt-0 md:w-1/2">
        {#each rightList as chord}
          <div class="flex items-center justify-center px-1 bg-gray-200">{chord[0]}</div>
          <div class="intervals">
            {#each chord[1].notes as interval}
              <span>{interval}</span>
            {/each}
          </div>
          <div class="text-xs">{chord[1].name}</div>
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
  .chord-list {
    display: grid;
    gap: 0.25rem;
    grid-template-columns: 1fr 4fr 5fr;
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
