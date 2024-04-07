<script lang="ts">
  import type { Interval, Scale } from '@/chords-and-scales'

  export let scale: Scale, intervals: Interval[]
</script>

<div class={`${$$props.class || ''} `}>
  <button class="flex flex-wrap justify-between w-full" on:click>
    <div class="intervals text-left">
      {#each scale.scaleNotes || [] as scaleNote}
        <span>{scaleNote.note}</span>
      {/each}
    </div>
    <div class="intervals text-right">
      {#each intervals as interval}
        <span>{interval.interval}</span>
      {/each}
    </div>
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
