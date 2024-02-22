<script lang="ts">
  import { gameActions, guessState } from '$stores/game'

  import type { GuessKeys } from '$games/GuessKeys'

  export let game: GuessKeys

  function tryAgain() {
    gameActions.play(game.type)
  }
  function clearGame() {
    gameActions.clearGame()
  }
</script>

<div class={`${$$props.class || ''} flex`}>
  {#if $guessState === 'correct' || $guessState === 'wrong'}
    <div>Target: {game.latestGuess.target}</div>
    <div class="ml-8">Guessed: {game.latestGuess.guessed}</div>
  {:else if $guessState === 'ended'}
    <div>
      <div>
        <span>Result: [{game.correct} / {game.sampled.length}]</span>
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
