<script lang="ts">
  import VirtualKey from './VirtualPianoKey.svelte'

  const WHITE_INDECES = [0, 2, 4, 5, 7, 9, 11]

  $: windowWidth = window.innerWidth
  let whiteKeyCount = 0
  const keys = Array.from(new Array(24)).map((_, idx) => {
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

<svelte:window bind:innerWidth={windowWidth} />

<ul class={`${$$props.class || ''} flex flex-row relative overflow-x-scroll`}>
  {#each keys as key, idx}
    <VirtualKey
      {key}
      keyCount={keys.length}
      isFirst={idx === 0}
      isLast={idx === keys.length - 1}
      width={windowWidth}
      on:pressed
    />
  {/each}
</ul>

<style lang="scss">
</style>
