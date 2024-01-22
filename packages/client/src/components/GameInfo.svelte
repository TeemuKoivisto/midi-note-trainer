<script lang="ts">
  import { currentGame, gameActions, guessState, played, target } from '$stores/game'
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

{#if $currentGame}
  <div class="flex">
    {#if $currentGame.type === 'pitches' && $guessState === 'waiting'}
      <div><button class="btn primary" on:click={replay}>Replay</button></div>
    {:else if $guessState === 'correct' || $guessState === 'wrong'}
      <div>Target: {$target?.absolute}</div>
      <div class="ml-8">Played: {$played?.absolute}</div>
    {:else if $guessState === 'ended'}
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
    {/if}
  </div>
{:else}
  <div class="flex">
    {#if $played}
      <div>Played: {$played.absolute}</div>
    {/if}
  </div>
{/if}

<style lang="scss">
</style>
