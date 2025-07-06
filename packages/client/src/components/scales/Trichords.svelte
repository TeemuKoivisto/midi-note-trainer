<script lang="ts">
  import type { ScaleTrichord } from '@/chords-and-scales'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    trichords: ScaleTrichord[]
    chords: string[]
    onClick: () => void
  }

  let { trichords, chords, onClick, ...rest }: Props = $props()
</script>

<div
  {...rest}
  class={`${rest.class || ''} `}
  title={trichords.map(t => t.roman + t.suffix).join('-')}
>
  <button class="trichords flex flex-wrap" onclick={onClick}>
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
            class="top-[-0.3rem] block text-sm leading-none"
            class:super-text={tc.suffix.length > 2}>{tc.suffix}</sup
          >
        </span>
      {/each}
    {/if}
  </button>
</div>

<style lang="postcss">
  @reference "#app.pcss";

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
