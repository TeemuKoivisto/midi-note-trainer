<script lang="ts">
  import { currentGame, gameActions, guessState } from '$stores/game'
  import { played, target } from '$stores/score'
  import { piano } from '$stores/midi'

  function replay() {
    $piano?.noteOn($currentGame!.current, 80)
  }
  function tryAgain() {
    gameActions.playGuessNotes($currentGame!.type)
  }
  function clearGame() {
    gameActions.clearGame()
  }
</script>

<div class={`${$$props.class || ''} flex`}>
  {#if $currentGame?.type === 'pitches' && $guessState === 'waiting'}
    <div><button class="btn primary" on:click={replay}>Replay</button></div>
  {:else if ($currentGame && $guessState === 'correct') || $guessState === 'wrong'}
    <div>Target: {$target?.absolute}</div>
    {#if $played.length > 0}
      <div class="ml-8">Played: {$played[0].absolute}</div>
    {/if}
  {:else if $currentGame && $guessState === 'ended'}
    <div>
      <div>
        <span>Result: [{$currentGame.correct} / {$currentGame.notes.length}]</span>
        <span>avg {$currentGame.avgTime}s</span>
      </div>
      <div>
        <button class="btn primary" on:click={tryAgain}>Try Again</button>
        <button class="btn primary" on:click={clearGame}>Clear</button>
      </div>
    </div>
  {:else if $played.length > 0}
    <div>Played: {$played[0].absolute}</div>
  {:else}
    &nbsp;
  {/if}
</div>

<style lang="scss">
</style>
