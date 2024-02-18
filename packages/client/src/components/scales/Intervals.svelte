<script lang="ts">
  import type { Interval, Scale } from '@/chords-and-scales'

  export let scale: Scale | undefined, intervals: Interval[]
</script>

<div class={`${$$props.class || ''} `} title={intervals.map(i => i.interval).join('-')}>
  <button class="intervals" on:click>
    {#if scale}
      {#each scale.scaleNotes || [] as scaleNote}
        <span>{scaleNote.note}</span>
      {/each}
    {:else}
      {#each intervals as interval}
        <span>{interval.interval}</span>
      {/each}
    {/if}
  </button>
</div>

<style lang="scss">
  .intervals {
    & > span + span::before {
      content: '-';
      @apply text-xs mx-[1px];
    }
  }
</style>
