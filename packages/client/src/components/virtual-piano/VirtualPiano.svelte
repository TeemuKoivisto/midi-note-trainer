<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import VirtualKey from './VirtualPianoKey.svelte'

  const WHITE_INDECES = [0, 2, 4, 5, 7, 9, 11]
  const dispatch = createEventDispatcher<{
    pressed: number
  }>()

  let whiteKeyCount = 0
  const rows = Array.from(new Array(24)).map((_, idx) => {
    const isWhite = WHITE_INDECES.includes(idx % 12)
    if (isWhite) {
      whiteKeyCount += 1
    }
    return {
      idx,
      isWhite,
      whiteKeyCount
    }
  })

  function handleKeyClicked(idx: number) {
    dispatch('pressed', idx)
  }
</script>

<ul class={`${$$props.class || ''} h-48 flex flex-row relative`}>
  {#each rows as key, ridx}
    <VirtualKey {key} on:click={() => handleKeyClicked(key.idx)} />
  {/each}
</ul>

<style lang="scss">
</style>
