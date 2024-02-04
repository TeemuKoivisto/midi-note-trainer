<script lang="ts">
  import { gameActions, guessState } from '$stores/game'
  import { played } from '$stores/score'

  import { getNoteAbsolute } from '$utils/getNote'

  import type { PlayChordsGame } from '$utils/play_chords'

  export let game: PlayChordsGame

  function tryAgain() {
    gameActions.playGuessChords('play')
  }
  function clearGame() {
    gameActions.clearGame()
  }
</script>

<div class={`${$$props.class || ''} flex`}>
  {#if $guessState === 'waiting'}
    <div class="min-h-32">
      <span>Played: </span>
      {#each $played as note}
        <span class="mx-1">{getNoteAbsolute(note)}</span>
      {/each}
    </div>
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
