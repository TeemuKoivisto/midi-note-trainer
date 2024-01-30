<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  // import volume from '@iconify-icons/feather/volume'
  import volume from '@iconify-icons/mdi/volume-high'

  import { currentGame } from '$stores/game'
  import { piano } from '$stores/inputs'
  import { GuessChords } from '$utils/guess_chords'
  import { GuessNotes } from '$utils/guess_notes'

  $: shown = $currentGame instanceof GuessChords || $currentGame instanceof GuessNotes

  function replay() {
    const game = $currentGame
    if (game instanceof GuessChords) {
      $piano?.playChord(game?.current, 80)
    } else if (game instanceof GuessNotes) {
      $piano?.noteOn(game.current, 80)
    }
  }
</script>

<div class={`${$$props.class || ''} wrapper`} class:hidden={!shown}>
  <button
    class="flex items-center justify-center rounded px-1 py-1 hover:bg-gray-200"
    on:click={replay}><Icon icon={volume} width={32} /></button
  >
</div>

<style lang="scss">
  .wrapper {
    left: -3rem;
    top: 18rem;
    @apply absolute;
  }
</style>
