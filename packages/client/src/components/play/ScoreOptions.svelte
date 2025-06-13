<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import restore from '@iconify-icons/mdi/restore'
  import arrowUp from '@iconify-icons/mdi/arrow-up'
  import arrowDown from '@iconify-icons/mdi/arrow-down'

  import { writable } from 'svelte/store'
  import { getNoteAbsolute, normalizeKey, parseNote, scalesFromJSON } from '@/chords-and-scales'

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
    const norm = normalizeKey(value)
    selectedKey = norm
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
  } relative flex w-[224px] flex-col rounded border-2 px-4 py-2 text-sm`}
  class:collapsed={$hidden}
>
  <legend class="flex w-fit text-base">
    <button class="z-0 rounded px-1 hover:bg-gray-100" on:click={toggleVisibility}>Score</button>
  </legend>
  <button
    class="absolute right-[0.5rem] top-[-0.25rem] flex items-center justify-center rounded px-1 py-1 hover:bg-gray-200"
    class:hidden={$hidden}
    on:click={resetKeyAndScale}
  >
    <Icon icon={restore} width={16} />
  </button>
  <div class="options" class:hidden={$hidden}>
    <div class="range flex flex-col">
      <label class="font-bold" for="range_min">Range</label>
      <div class="my-1 flex w-full items-center">
        <div class="mr-2 flex flex-col items-center rounded">
          <button
            class="rounded p-2 hover:bg-gray-200"
            on:click={() => inputsActions.shiftMidiRange(true, true)}
          >
            <Icon icon={arrowUp} width={20} />
          </button>
          <button
            class="mt-1 rounded p-2 hover:bg-gray-200"
            on:click={() => inputsActions.shiftMidiRange(true, false)}
          >
            <Icon icon={arrowDown} width={20} />
          </button>
        </div>
        <input
          id="range_min"
          class="h-[28px] w-full min-w-[2rem] rounded bg-transparent p-1 text-right"
          bind:value={rangeMin}
          on:change={e => handleRangeChanged('min', e)}
          on:focus={rangeFocus}
        />
        <span class="mx-2">—</span>
        <input
          id="range_max"
          class="w-full min-w-[2rem] rounded bg-transparent p-1"
          bind:value={rangeMax}
          on:change={e => handleRangeChanged('max', e)}
          on:focus={rangeFocus}
        />
        <div class="ml-2 flex flex-col items-center rounded">
          <button
            class="rounded p-2 hover:bg-gray-200"
            on:click={() => inputsActions.shiftMidiRange(false, true)}
          >
            <Icon icon={arrowUp} width={20} />
          </button>
          <button
            class="mt-1 rounded p-2 hover:bg-gray-200"
            on:click={() => inputsActions.shiftMidiRange(false, false)}
          >
            <Icon icon={arrowDown} width={20} />
          </button>
        </div>
      </div>
      <div class="my-1 flex justify-between">
        {#if rangeError}
          <div class="error">{rangeError}</div>
        {/if}
      </div>
    </div>
    <div class="flex flex-col">
      <label class="font-bold" for="score-scale">Scale</label>
      <div class="scale-dropdown my-1 w-full">
        <SearchDropdown
          id="score-scale"
          class="w-full p-1 pl-[2px]"
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
    <div class="flex flex-col">
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

<style lang="postcss">
  @reference "#app.pcss";

  .collapsed {
    @apply h-8 py-0.5;
  }
  .options {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    .scale-dropdown {
      --search-dropdown-width: 100%;
    }
    @media (width <= 656px) {
      grid-template-columns: 1fr 1fr;
      .range {
        grid-column-end: span 2;
      }
      .scale-dropdown {
        --search-dropdown-width: 100%;
      }
      #key {
        width: 100%;
      }
    }

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
