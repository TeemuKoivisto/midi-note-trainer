<script lang="ts">
  import { gameActions, guessState } from '$stores/game'
  import { piano } from '$stores/inputs'

  import type { GuessChords } from '$utils/guess_chords'

  export let game: GuessChords

  function replay() {
    $piano?.playChord(game.current)
  }
  function tryAgain() {
    gameActions.playGuessChords()
  }
  function clearGame() {
    gameActions.clearGame()
  }
</script>

<div class={`${$$props.class || ''} flex`}>
  {#if $guessState === 'waiting'}
    <div><button class="btn primary" on:click={replay}>Replay</button></div>
  {:else if $guessState === 'correct' || $guessState === 'wrong'}
    <div>Target: {game.latestGuess.target}</div>
    <div class="ml-8">Guessed: {game.latestGuess.guessed}</div>
  {:else if $guessState === 'ended'}
    <div>
      <div>
        <span>Result: [{game.correct} / {game.chords.length}]</span>
        <span>avg {game.avgTime}s</span>
      </div>
      <div>
        <button class="btn primary" on:click={tryAgain}>Try Again</button>
        <button class="btn primary" on:click={clearGame}>Clear</button>
      </div>
    </div>
  {:else}
    &nbsp;
  {/if}
</div>

<style lang="scss">
</style>
