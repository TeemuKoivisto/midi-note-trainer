<script lang="ts">
  import type { Interval, Scale } from '@/chords-and-scales'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    scale: Scale
    intervals: Interval[]
    onClick: () => void
  }

  let { scale, intervals, onClick, ...rest }: Props = $props()
</script>

<div {...rest} class={`${rest.class || ''} `}>
  <button class="flex w-full flex-wrap justify-between" onclick={onClick}>
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

<style lang="postcss">
  @reference "#app.pcss";

  .intervals {
    & > span + span::before {
      content: '-';
      @apply mx-[1px] text-xs;
    }
  }
</style>
