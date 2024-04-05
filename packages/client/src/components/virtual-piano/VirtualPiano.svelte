<script lang="ts">
  import VirtualKey from './VirtualPianoKey.svelte'

  const WHITE_INDECES = [0, 2, 4, 5, 7, 9, 11]

  let whiteKeyCount = 0
  const rows = Array.from(new Array(12)).map((_, idx) => {
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
</script>

<ul class={`${$$props.class || ''} h-48 flex flex-row relative`}>
  {#each rows as key, idx}
    <VirtualKey {key} isFirst={idx === 0} isLast={idx === rows.length - 1} on:pressed />
  {/each}
</ul>

<style lang="scss">
</style>
