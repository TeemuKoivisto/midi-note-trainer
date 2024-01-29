<script lang="ts">
  import { gameActions, guessState } from '$stores/game'
  import { played, target } from '$stores/score'
  import { piano } from '$stores/inputs'

  import type { GuessNotes } from '$utils/guess_notes'
  import { getNote } from '$utils/getNote'

  export let game: GuessNotes

  function replay() {
    $piano?.noteOn(game.current, 80)
  }
  function tryAgain() {
    gameActions.playGuessNotes(game.type)
  }
  function clearGame() {
    gameActions.clearGame()
  }
</script>

<div class={`${$$props.class || ''} flex`}>
  {#if game.type === 'pitches' && $guessState === 'waiting'}
    <div><button class="btn primary" on:click={replay}>Replay</button></div>
  {:else if $guessState === 'correct' || $guessState === 'wrong'}
    <div>Target: {$target?.absolute}</div>
    <div class="ml-8">Played: {getNote(game.guessed).absolute}</div>
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
