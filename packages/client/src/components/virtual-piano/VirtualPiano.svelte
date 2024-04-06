<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { derived, writable } from 'svelte/store'

  import arrowDown from '@iconify-icons/mdi/arrow-down'
  import arrowUp from '@iconify-icons/mdi/arrow-up'

  import IconButton from '$elements/IconButton.svelte'
  import VirtualKey from './VirtualPianoKey.svelte'

  import { midiRange } from '$stores/inputs'
  import { getNote, getNoteAbsolute } from '@/chords-and-scales'

  export let height: number

  const WHITE_INDECES = [0, 2, 4, 5, 7, 9, 11]
  const C0_MIDI = 12
  const C7_MIDI = 96

  let innerWidth = window.innerWidth
  $: pianoWidth = Math.min(innerWidth, 780)

  const bottomNoteMidi = writable(findClosestC($midiRange[0]))
  const bottomNote = derived(bottomNoteMidi, v => getNoteAbsolute(getNote(v)))
  const topNote = derived(bottomNoteMidi, v => getNoteAbsolute(getNote(v + 23)))
  const dispatch = createEventDispatcher<{
    pressed: number
  }>()

  let whiteKeyCount = 0
  const keys = Array.from(new Array(12)).map((_, idx) => {
    const isWhite = WHITE_INDECES.includes(idx % 12)
    if (isWhite) {
      whiteKeyCount += 1
    }
    return {
      idx,
      isWhite,
      whiteKeyCount
    }
  })

  midiRange.subscribe(v => {
    // Reset to range lowest C note when changed
    bottomNoteMidi.set(findClosestC(v[0]))
  })

  function findClosestC(midi: number) {
    return midi % 12 === 0 ? midi : midi - (midi % 12)
  }

  function shiftRange(up: boolean) {
    bottomNoteMidi.update(v => (up ? Math.min(v + 12, C7_MIDI) : Math.max(v - 12, C0_MIDI)))
  }

  function handleKeyPressed(e: CustomEvent<{ idx: number; row: number }>) {
    dispatch('pressed', $bottomNoteMidi + e.detail.idx + e.detail.row * 12)
  }
</script>

<svelte:window bind:innerWidth />

<section>
  <div class="flex justify-between px-1.5 pb-1">
    <div class="flex items-center">
      <IconButton icon={arrowDown} size={32} on:click={() => shiftRange(false)} />
      <div class="pl-4">{$bottomNote}</div>
    </div>
    <div class="flex items-center">
      <div class="pr-4">{$topNote}</div>
      <IconButton icon={arrowUp} size={32} on:click={() => shiftRange(true)} />
    </div>
  </div>
  <ul class="flex flex-row relative overflow-x-scroll" style="height: {height}px;">
    {#each keys as key, idx}
      <VirtualKey
        {key}
        row={1}
        keyCount={keys.length}
        isFirst={idx === 0}
        isLast={idx === keys.length - 1}
        {pianoWidth}
        on:pressed={handleKeyPressed}
      />
    {/each}
  </ul>
  <ul class="flex flex-row relative overflow-x-scroll" style="height: {height}px;">
    {#each keys as key, idx}
      <VirtualKey
        {key}
        row={0}
        keyCount={keys.length}
        isFirst={idx === 0}
        isLast={idx === keys.length - 1}
        {pianoWidth}
        on:pressed={handleKeyPressed}
      />
    {/each}
  </ul>
</section>

<style lang="scss">
</style>
