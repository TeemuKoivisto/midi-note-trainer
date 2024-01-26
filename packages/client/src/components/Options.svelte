<script lang="ts">
  import { scales } from '@/music-scales'

  import { midiActions, midiInput, midiRange } from '$stores/inputs'
  import { key, scale, scoreActions } from '$stores/score'
  import { keys } from '$utils/guess_keys'
  import { getNote, parseNote } from '$utils/midi'

  import MultiSelectDropdown from '$elements/MultiSelectDropdown.svelte'

  let rangeMin = getNote($midiRange[0]).absolute
  let rangeMax = getNote($midiRange[1]).absolute
  let rangeError = ''
  let hidden = false

  let selectedKey = $key

  const scaleOptions = Object.entries(scales).map(([k, v]) => ({
    key: k,
    value: v.name
  }))
  let selectedScale = $scale

  function handleSetRange() {
    // prompt -> press the lowest note in your MIDI device
    // press the highest note in your MIDI device
  }
  function handleRangeChanged(
    rang: 'min' | 'max',
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement
    }
  ) {
    const parsed = parseNote(e.currentTarget.value)
    if ('data' in parsed) {
      const old = $midiRange
      const range = [
        rang === 'min' ? parsed.data : old[0],
        rang === 'max' ? parsed.data : old[1]
      ] as [number, number]
      midiActions.setMidiRange(range)
      rangeError = ''
    } else {
      rangeError = parsed.err
      if (rang === 'min') {
        rangeMin = getNote($midiRange[0]).absolute
      } else {
        rangeMax = getNote($midiRange[1]).absolute
      }
    }
  }
  function handleKeyChange({
    currentTarget: { value }
  }: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    let val = value.charAt(0)
    if (val.length > 1) {
      val += value.charAt(1).toLowerCase() //.replaceAll('b', '♭').replaceAll('#', '♯')
    }
    scoreActions.setKey(val)
  }
  function handleKeyBlur() {
    if (selectedKey in keys.major || selectedKey in keys.minor) {
      selectedKey = selectedKey.replaceAll('b', '♭').replaceAll('#', '♯')
    } else {
      selectedKey = $key
    }
  }
  function handleSelectScale(key: string) {
    selectedScale = scaleOptions.find(k => key === k.key)?.value as string
    return false
  }
  function toggleVisibility() {
    hidden = !hidden
  }
</script>

<div class={`${$$props.class || ''}`}>
  <fieldset class="flex flex-col rounded border-2 px-4 py-2 my-4 text-sm">
    <legend class="px-2 text-0A text-base">
      <button class="hover:bg-gray-100" on:click={toggleVisibility}>Options</button>
    </legend>
    <div class="body" class:hidden>
      <div class="flex flex-col">
        <label class="font-bold" for="range_min">Range</label>
        <div class="my-1 flex w-full">
          <input
            class="w-full"
            id="range_min"
            bind:value={rangeMin}
            on:change={e => handleRangeChanged('min', e)}
          />
          <span class="mx-4">—</span>
          <input
            class="w-full"
            id="range_max"
            bind:value={rangeMax}
            on:change={e => handleRangeChanged('max', e)}
          />
        </div>
        <div>
          {#if rangeError}
            <div class="error">{rangeError}</div>
          {/if}
          <button class="btn primary" on:click={handleSetRange}>Use MIDI</button>
        </div>
      </div>
      <div class="flex flex-col h-full">
        <label class="font-bold" for="scales">Scales</label>
        <div class="my-1 w-full">
          <MultiSelectDropdown
            id="scales"
            class="p-1"
            options={scaleOptions}
            onSelect={handleSelectScale}
          >
            <div slot="value">{selectedScale}</div>
          </MultiSelectDropdown>
        </div>
      </div>
      <div class="flex flex-col h-full">
        <label class="font-bold" for="key">Key</label>
        <div class="my-1 flex">
          <input
            class="h-[20px]"
            id="key"
            bind:value={selectedKey}
            on:input={handleKeyChange}
            on:blur={handleKeyBlur}
          />
        </div>
      </div>
    </div>
  </fieldset>
</div>

<style lang="scss">
  .body {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: auto;
    align-items: center;
    @media (width <= 475px) {
      grid-template-columns: 1fr 1fr;
    }
    &.hidden {
      display: none;
    }
  }
  .error {
    @apply text-xs text-red-500;
  }
</style>
