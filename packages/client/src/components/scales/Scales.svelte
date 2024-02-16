<script lang="ts">
  import { writable } from 'svelte/store'
  import { createScale, createTriadChords, scales } from '@/chords-and-scales'

  import Intervals from './Intervals.svelte'
  import Triads from './Triads.svelte'

  import { inputsActions } from '$stores/inputs'
  import { persist } from '$stores/persist'

  import type { MidiNote, RawScale, Scale, ScaleTriad } from '@/chords-and-scales'

  interface ListItem {
    key: string
    raw: RawScale
    scale: Scale | undefined
    triads: ScaleTriad[]
    triadChords: { chord: string; notes: MidiNote[] }[]
  }

  let scalesList: ListItem[] = Array.from(scales.entries()).map(([k, s]) => {
    const created = createScale('C', k)
    const triads = 'data' in created ? created.data.triads : []
    return { key: k, raw: s, scale: undefined, triads, triadChords: [] }
  })
  $: leftList = scalesList.filter((_, i) => i < scalesList.length / 2)
  $: rightList = scalesList.filter((_, i) => i >= scalesList.length / 2)

  let shownKey = ''

  const hidden = persist(writable(false), { key: 'scales-hidden' })

  function toggleVisibility() {
    hidden.update(h => !h)
  }
  function handleKeyChange({
    currentTarget: { value }
  }: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    shownKey = `${value.charAt(0).toUpperCase()}${value.charAt(1).toLowerCase()}`
    scalesList = scalesList.map(d => {
      const created = createScale(shownKey, d.key)
      const data = shownKey && 'data' in created ? created.data : undefined
      const chords = data ? createTriadChords(d.triads, data) : []
      return { ...d, scale: data, triadChords: chords }
    })
  }
</script>

<div class={`${$$props.class || ''}`}>
  <fieldset class="flex flex-col rounded border-2 px-4 py-2 my-4 text-sm" class:collapsed={$hidden}>
    <legend class="text-0A text-base">
      <button class="px-1 rounded hover:bg-gray-100" on:click={toggleVisibility}>Scales</button>
    </legend>
    <div class="body" class:hidden={$hidden}>
      <div class="flex w-1/2 mb-2 input">
        <label class="mr-4 font-bold" for="scale-key">Key</label>
        <input
          class="bg-gray-100 w-16 px-1 rounded"
          id="scale-key"
          value={shownKey}
          on:input={handleKeyChange}
          on:focus={() => inputsActions.setKeyboardFocus(false)}
          on:blur={() => inputsActions.setKeyboardFocus(true)}
        />
      </div>
      <ul class="list odd w-full">
        {#each leftList as scale}
          <li>
            <div class="text-xs font-bold">{scale.raw.name}</div>
            <Intervals scale={scale.scale} intervals={scale.raw.intervals} />
            <Triads class="triads" triads={scale.triads} chords={scale.triadChords} />
          </li>
        {/each}
      </ul>
      <ul class="list even w-full">
        {#each rightList as scale}
          <li>
            <div class="text-xs font-bold">{scale.raw.name}</div>
            <Intervals scale={scale.scale} intervals={scale.raw.intervals} />
            <Triads class="triads" triads={scale.triads} chords={scale.triadChords} />
          </li>
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
  :global(.triads) {
    // grid-column-end: span 2;
    // @apply border-b;
  }
  .list {
    @apply flex flex-col gap-1;
    & > li {
      display: grid;
      grid-template-columns: auto;
      grid-template-rows: auto;
      align-items: center;
      @apply rounded p-1;
      & > :global(.intervals) {
        @apply mt-0.5;
      }
    }
    &.even {
      & > li:nth-child(even) {
        @apply bg-gray-100;
      }
    }
    &.odd {
      & > li:nth-child(odd) {
        @apply bg-gray-100;
      }
    }
  }
  .error {
    @apply text-xs text-red-500;
  }
</style>
