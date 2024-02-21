<script lang="ts">
  import Options from '$components/Options.svelte'

  import { gameActions, type GameType } from '$stores/game'

  function clearGame() {
    gameActions.clearGame()
  }
  function play(type: GameType) {
    gameActions.play(type)
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
  }
</script>

<div class={`${$$props.class || ''}`}>
  <fieldset class="flex flex-col rounded border-2 px-4 py-2 my-4 text-sm">
    <legend class="px-1 text-base">Play</legend>
    <Options class="border-b-2 pb-4" />
    <div class="body pt-6">
      <button class="btn primary" on:click={() => play('notes')}>Guess 10 Notes</button>
      <button class="btn primary" on:click={() => play('pitches')}>Guess 10 Pitches</button>
      <button class="btn primary" on:click={() => play('keys-major')}>Guess Major Keys</button>
      <button class="btn primary" on:click={() => play('keys-minor')}>Guess Minor Keys</button>
      <button class="btn primary" on:click={() => play('chords-write')}>Write Chords</button>
      <button class="btn primary" on:click={() => play('chords-play')}>Play Chords</button>
      <button class="btn primary" on:click={() => play('chords-diatonic')}
        >Play Diatonic Triads</button
      >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <button class="btn hover:bg-gray-200" on:click={clearGame}>Clear</button>
    </div>
  </fieldset>
</div>

<style lang="scss">
  .body {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: auto;
    align-items: center;
    @media (width <= 475px) {
      grid-template-columns: 1fr 1fr;
    }
  }
  .error {
    @apply text-xs text-red-500;
  }
</style>
