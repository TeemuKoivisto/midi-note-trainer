<script lang="ts">
  import type { ScaleTrichord } from '@/chords-and-scales'

  export let trichords: ScaleTrichord[], chords: string[]
</script>

<div class={`${$$props.class || ''} `} title={trichords.map(t => t.roman + t.suffix).join('-')}>
  <button class="trichords flex flex-wrap" on:click>
    {#if chords.length > 0}
      {#each chords as chord}
        <span class="inline-flex items-baseline">
          <span>
            {chord}
          </span>
        </span>
      {/each}
    {:else}
      {#each trichords as tc}
        <span class="inline-flex items-baseline">
          <span class="block">
            {tc.roman}
          </span>
          <sup
            class="block text-sm leading-none top-[-0.3rem]"
            class:super-text={tc.suffix.length > 2}>{tc.suffix}</sup
          >
        </span>
      {/each}
    {/if}
  </button>
</div>

<style lang="scss">
  .trichords {
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
