<script lang="ts">
  import type { ScaleTriad } from '@/chords-and-scales'

  export let triads: ScaleTriad[], chords: string[]
</script>

<div class={`${$$props.class || ''} `} title={triads.map(t => t.roman + t.suffix).join('-')}>
  <button class="triads flex flex-wrap" on:click>
    {#if chords.length > 0}
      {#each chords as chord}
        <span class="inline-flex items-baseline">
          <span>
            {chord}
          </span>
        </span>
      {/each}
    {:else}
      {#each triads as triad}
        <span class="inline-flex items-baseline">
          <span class="block">
            {triad.roman}
          </span>
          <sup
            class="block text-sm leading-none top-[-0.3rem]"
            class:super-text={triad.suffix.length > 2}>{triad.suffix}</sup
          >
        </span>
      {/each}
    {/if}
  </button>
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
