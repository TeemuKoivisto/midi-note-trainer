<script lang="ts">
  import { gameActions, guessState } from '$stores/game'
  import { target } from '$stores/score'

  import type { GuessNotes } from '$games/GuessNotes'
  import { getNote, getNoteAbsolute } from '$utils/getNote'

  export let game: GuessNotes

  function tryAgain() {
    gameActions.playGuessNotes(game.type)
  }
  function clearGame() {
    gameActions.clearGame()
  }
</script>

<div class={`${$$props.class || ''} flex`}>
  {#if $guessState === 'correct' || $guessState === 'wrong'}
    <div>Target: {getNoteAbsolute($target[0])}</div>
    <div class="ml-8">Played: {getNoteAbsolute(getNote(game.guessed))}</div>
  {:else if $guessState === 'ended'}
    <div>
      <div>
        <span>Result: [{game.correct} / {game.notes.length}]</span>
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
