<script lang="ts">
  import { onMount } from 'svelte'

  import { midiActions, midiInput } from '$stores/midi'

  function handleSetRange() {
    // prompt -> press the lowest note in your MIDI device
    // press the highest note in your MIDI device
  }
</script>

<div class={`${$$props.class || ''}`}>
  <fieldset class="flex flex-col rounded border-2 px-4 py-2 my-4 text-sm">
    <legend class="px-2 text-0A text-base">MIDI</legend>
    <div class="midi-body">
      <div class="flex flex-col">
        <label class="font-bold" for="device">Device</label>
        <input class="my-1 w-50" id="device" disabled value={$midiInput?.name ?? 'No device'} />
        <div>
          <button class="btn primary" on:click={midiActions.openMidi}>Prompt</button>
        </div>
      </div>
      <div class="flex flex-col">
        <label class="font-bold" for="range_min">Range</label>
        <div class="my-1 flex">
          <input class="w-10" id="range_min" value={'C4'} />
          <span class="mx-2">-</span>
          <input class="w-10" id="range_max" value={'C5'} />
        </div>
        <div>
          <button class="btn primary" on:click={handleSetRange}>Use MIDI</button>
        </div>
      </div>
    </div>
  </fieldset>
</div>

<style lang="scss">
  .midi-body {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: 25% 25%;
    grid-template-rows: auto;
    align-items: center;
  }
</style>
