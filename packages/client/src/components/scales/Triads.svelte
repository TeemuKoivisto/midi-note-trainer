<script lang="ts">
  import type { MidiNote, ScaleTriad } from '@/chords-and-scales'

  export let triads: ScaleTriad[], chords: { chord: string; notes: MidiNote[] }[]
</script>

<div
  class={`${$$props.class || ''} triads flex flex-wrap`}
  title={triads.map(t => t.parts.join('')).join('-')}
>
  {#if chords.length > 0}
    {#each chords as chord}
      <span class="inline-flex items-baseline">
        <span>
          {chord.chord}
        </span>
      </span>
    {/each}
  {:else}
    {#each triads as triad}
      <span class="inline-flex items-baseline">
        <span class="block">
          {triad.parts[0]}
        </span>
        <sup
          class="block text-sm leading-none top-[-0.3rem]"
          class:super-text={triad.parts[1].length > 2}>{triad.parts[1]}</sup
        >
      </span>
    {/each}
  {/if}
</div>

<style lang="scss">
  .triads {
    & > span + span::before {
      content: '-';
      @apply mx-[4px];
    }
    .super-text {
      top: -0.3rem;
      @apply text-xs;
    }
  }
</style>
