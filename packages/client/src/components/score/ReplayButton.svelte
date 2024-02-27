<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import volume from '@iconify-icons/mdi/volume-high'

  import { currentGame, guessState } from '$stores/game'
  import { piano } from '$stores/inputs'
  import { GuessChords, GuessNotes } from '@/games'

  $: shown = $currentGame instanceof GuessChords || $currentGame instanceof GuessNotes

  function replay() {
    const game = $currentGame
    if (game instanceof GuessChords && $guessState === 'waiting') {
      $piano?.playChord(game.current.notes.map(n => n.midi))
    } else if (game instanceof GuessChords) {
      $piano?.playChord((game.latestGuess.target?.notes || []).map(n => n.midi))
    } else if (game instanceof GuessNotes && $guessState === 'waiting') {
      $piano?.noteOn(game.current)
    } else if (game instanceof GuessNotes) {
      $piano?.noteOn(game.latestGuess.target || 0)
    }
  }
</script>

<div class={`${$$props.class || ''}`} class:hidden={!shown}>
  <button
    class="flex items-center justify-center rounded px-1 py-1 hover:bg-gray-200"
    on:click={replay}><Icon icon={volume} width={32} /></button
  >
</div>

<style lang="scss">
</style>
