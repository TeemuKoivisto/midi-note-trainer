<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import restore from '@iconify-icons/mdi/restore'
  import { writable } from 'svelte/store'
  import { getNoteAbsolute, parseNote, scalesFromJSON } from '@/chords-and-scales'

  import { currentGame } from '$stores/game'
  import { inputsActions, midiRangeNotes } from '$stores/inputs'
  import { persist } from '$stores/persist'
  import { keyAndScale, scaleData, scoreActions } from '$stores/score'

  import SearchDropdown from '$elements/SearchDropdown.svelte'

  let rangeMin = getNoteAbsolute($midiRangeNotes[0])
  let rangeMax = getNoteAbsolute($midiRangeNotes[1])
  let rangeError = ''
  const hidden = persist(writable(false), { key: 'score-options-hidden' })

  let selectedKey = $keyAndScale[0]
  let selectedScale = $keyAndScale[1]

  const scales = scalesFromJSON()
  const scaleOptions = scales.map(scl => ({
    key: scl.names[0],
    value: scl.names[0]
  }))
  $: selectedScaleNotes = scales.find(scl => scl.names[0] === selectedScale)?.intervals || []

  midiRangeNotes.subscribe(rng => {
    rangeMin = getNoteAbsolute(rng[0])
    rangeMax = getNoteAbsolute(rng[1])
  })
  keyAndScale.subscribe(v => {
    selectedKey = v[0]
    selectedScale = v[1]
  })

  function handleRangeChanged(
    rang: 'min' | 'max',
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement
    }
  ) {
    const parsed = parseNote(e.currentTarget.value, true, true)
    if ('data' in parsed) {
      const { midi } = parsed.data
      const old = $midiRangeNotes
      const range: [number, number] = [
        rang === 'min' ? midi : old[0].midi,
        rang === 'max' ? midi : old[1].midi
      ]
      inputsActions.setMidiRange(range)
      rangeError = ''
    } else {
      rangeError = parsed.err
      if (rang === 'min') {
        rangeMin = getNoteAbsolute($midiRangeNotes[0])
      } else {
        rangeMax = getNoteAbsolute($midiRangeNotes[1])
      }
    }
  }
  function rangeFocus() {
    rangeError = ''
  }
  function handleKeyChange({
    currentTarget: { value }
  }: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    selectedKey = `${value.charAt(0).toUpperCase()}${value.charAt(1).toLowerCase()}`
    scoreActions.setKey(selectedKey)
  }
  function handleSelectScale(key: string | number) {
    selectedScale = scaleOptions.find(k => key === k.key)?.value as string
    scoreActions.setScale(selectedScale)
    return false
  }
  function toggleVisibility() {
    hidden.update(h => !h)
  }
  function resetKeyAndScale() {
    scoreActions.clearScore(true)
    inputsActions.setMidiRange([60, 84])
  }
</script>

<fieldset
  class={`${
    $$props.class || ''
  } flex flex-col rounded border-2 px-4 py-2 w-[224px] relative text-sm`}
  class:collapsed={$hidden}
>
  <legend class="text-base">
    <button class="px-1 rounded hover:bg-gray-100" on:click={toggleVisibility}>Score</button>
  </legend>
  <button
    class="absolute top-[-0.25rem] right-[0.5rem] flex items-center justify-center rounded px-1 py-1 hover:bg-gray-200"
    class:hidden={$hidden}
    on:click={resetKeyAndScale}
  >
    <Icon icon={restore} width={16} />
  </button>
  <div class="options" class:hidden={$hidden}>
    <div class="range flex flex-col h-full">
      <label class="font-bold" for="range_min">Range</label>
      <div class="my-1 flex w-full">
        <input
          class="h-[28px] w-full"
          id="range_min"
          bind:value={rangeMin}
          on:change={e => handleRangeChanged('min', e)}
          on:focus={rangeFocus}
        />
        <span class="mx-2 mt-1">—</span>
        <input
          class="h-[28px] w-full"
          id="range_max"
          bind:value={rangeMax}
          on:change={e => handleRangeChanged('max', e)}
          on:focus={rangeFocus}
        />
      </div>
      <div class="flex justify-between my-1">
        {#if rangeError}
          <div class="error">{rangeError}</div>
        {/if}
      </div>
    </div>
    <div class="flex flex-col h-full">
      <label class="font-bold" for="score-scale">Scale</label>
      <div class="my-1 w-full">
        <SearchDropdown
          id="score-scale"
          class="p-1 pl-[2px] w-48"
          containerClass="w-48"
          selected={selectedScale}
          options={scaleOptions}
          onSelect={handleSelectScale}
        />
      </div>
      {#if !$currentGame}
        <div class="intervals my-1">
          {#each selectedScaleNotes as interval}
            <span>{interval.interval}</span>
          {/each}
        </div>
      {/if}
    </div>
    <div class="flex flex-col h-full">
      <label class="font-bold" for="key">Key</label>
      <div class="my-1 flex">
        <input class="h-[28px]" id="key" bind:value={selectedKey} on:input={handleKeyChange} />
      </div>
      {#if !$currentGame}
        <div class="intervals my-1">
          {#each $scaleData.scaleNotes as note}
            <span>{note.note}</span>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</fieldset>

<style lang="scss">
  .collapsed {
    @apply h-8 py-0.5;
  }
  .options {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    &.hidden {
      display: none;
    }
  }
  .error {
    @apply text-xs text-red-500;
  }
  .intervals {
    & > span + span::before {
      content: '-';
      @apply mx-[1px];
    }
  }
</style>
