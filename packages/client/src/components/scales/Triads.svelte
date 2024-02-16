<script lang="ts">
  import type { ScaleTriad } from '@/chords-and-scales'

  export let triads: ScaleTriad[]
</script>

<div class={`${$$props.class || ''} triads flex flex-wrap`}>
  {#each triads as triad}
    <span class="inline-flex">
      <span>
        {triad.parts[0]}
      </span>
      <span>{triad.parts[1]}</span>
    </span>
  {/each}
</div>

<style lang="scss">
  .triads {
    & > span + span::before {
      content: '-';
      @apply text-xs mx-[1px];
    }
  }
</style>
