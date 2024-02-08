<script lang="ts">
  import { writable } from 'svelte/store'
  import { createScale, scales, type Scale } from '@/chords-and-scales'

  import { persist } from '$stores/persist'

  $: scalesList = Array.from(scales.entries())
  $: leftList = scalesList.filter((_, i) => i < scalesList.length / 2)
  $: rightList = scalesList.filter((_, i) => i >= scalesList.length / 2)

  let shownKey = ''
  let leftScales: (Scale | undefined)[] = []
  let rightScales: (Scale | undefined)[] = []

  const hidden = persist(writable(false), { key: 'scales-hidden' })

  function toggleVisibility() {
    hidden.update(h => !h)
  }
  function handleKeyChange({
    currentTarget: { value }
  }: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    shownKey = `${value.charAt(0).toUpperCase()}${value.charAt(1).toLowerCase()}`
    leftScales = leftList.map(s => {
      const scale = createScale(shownKey, s[0])
      if ('data' in scale) {
        return scale.data
      }
      return undefined
    })
    rightScales = rightList.map(s => {
      const scale = createScale(shownKey, s[0])
      if ('data' in scale) {
        return scale.data
      }
      return undefined
    })
  }
</script>

<div class={`${$$props.class || ''}`}>
  <fieldset class="flex flex-col rounded border-2 px-4 py-2 my-4 text-sm" class:collapsed={$hidden}>
    <legend class="px-2 text-0A text-base">
      <button class="hover:bg-gray-100" on:click={toggleVisibility}>Scales</button>
    </legend>
    <div class="body" class:hidden={$hidden}>
      <div class="flex w-1/2 mb-2 input">
        <label class="mr-4 font-bold" for="scale-key">Key</label>
        <input
          class="bg-gray-100 w-16 px-1 rounded"
          id="scale-key"
          value={shownKey}
          on:input={handleKeyChange}
        />
      </div>
      <ul class="list w-full">
        {#each leftList as scale, idx}
          <div class="intervals" title={scale[1].intervals.map(i => i.str).join('-')}>
            {#if leftScales[idx]}
              {#each leftScales[idx]?.scaleNotes || [] as scaleNote}
                <span>{scaleNote.note}</span>
              {/each}
            {:else}
              {#each scale[1].intervals as interval}
                <span>{interval.str}</span>
              {/each}
            {/if}
          </div>
          <div class="text-xs">{scale[1].name}</div>
        {/each}
      </ul>
      <ul class="list w-full">
        {#each rightList as scale, idx}
          <div class="intervals" title={scale[1].intervals.map(i => i.str).join('-')}>
            {#if rightScales[idx]}
              {#each rightScales[idx]?.scaleNotes || [] as scaleNote}
                <span>{scaleNote.note}</span>
              {/each}
            {:else}
              {#each scale[1].intervals as interval}
                <span>{interval.str}</span>
              {/each}
            {/if}
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
  .body {
    display: grid;
    gap: 0.25rem;
    grid-template-columns: [col1] 1fr [col2] 1fr;
    grid-template-rows: auto;
    @media (width <= 600px) {
      grid-template-columns: 1fr;
    }
    &.hidden {
      display: none;
    }
  }
  .input {
    @media (width > 600px) {
      grid-column-end: span 2;
    }
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
