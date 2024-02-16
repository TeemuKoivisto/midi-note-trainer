<script lang="ts">
  import type { Interval, Scale } from '@/chords-and-scales'

  export let scale: Scale | undefined, intervals: Interval[]
</script>

<div class={`${$$props.class || ''} intervals`} title={intervals.map(i => i.str).join('-')}>
  {#if scale}
    {#each scale.scaleNotes || [] as scaleNote}
      <span>{scaleNote.note}</span>
    {/each}
  {:else}
    {#each intervals as interval}
      <span>{interval.str}</span>
    {/each}
  {/if}
</div>

<style lang="scss">
  .intervals {
    & > span + span::before {
      content: '-';
      @apply text-xs mx-[1px];
    }
  }
</style>
