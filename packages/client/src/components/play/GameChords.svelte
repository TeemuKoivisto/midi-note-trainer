<script lang="ts">
  import { gameActions, gameOptions, guessState } from '$stores/game'
  import { played } from '$stores/score'

  import { getNoteAbsolute } from '@/chords-and-scales'

  import type { GuessChords } from '@/games'

  export let game: GuessChords

  function nextGuess() {
    gameActions.nextGuess()
  }
  function autoplay() {
    gameActions.setOptionValue('autoplay', true)
    gameActions.nextGuess()
  }
  function tryAgain() {
    gameActions.play(game.type)
  }
  function clearGame() {
    gameActions.clearGame()
  }
</script>

<div class={`${$$props.class || ''} flex flex-col`}>
  {#if $guessState === 'waiting'}
    <div class="min-h-[3.25rem]">
      <span>Played: </span>
      {#each $played as note}
        <span class="mx-1">{getNoteAbsolute(note)}</span>
      {/each}
    </div>
    <div class="mt-2 h-8">&nbsp;</div>
  {:else if $guessState === 'correct' || $guessState === 'wrong'}
    <div class="guessed min-h-[3.25rem]">
      <span>Target:</span>
      <span>{game.latestGuess.target?.chord}</span>
      <span>{game.latestGuess.target?.notes.map(n => n.note).join(' ')}</span>
      <span>Guessed:</span>
      <span>{game.latestGuess.guessed?.chord}</span>
      <span>{game.latestGuess.guessed?.notes.map(n => n.note).join(' ')}</span>
    </div>
    <div class="mt-2 h-8">
      {#if $gameOptions.autoplay}
        <button class="btn primary" on:click={() => gameActions.setOptionValue('autoplay', false)}
          >Stop autoplay</button
        >
      {:else}
        <button class="btn primary" on:click={nextGuess}>Next</button>
        <button class="btn primary" on:click={autoplay}>Autoplay</button>
      {/if}
    </div>
  {:else if $guessState === 'ended'}
    <div class="min-h-[3.25rem]">
      <span>Result: [{game.correct} / {game.sampled.length}]</span>
      <span>avg {game.avgTime}s</span>
    </div>
    <div class="mt-2 h-8">
      <button class="btn primary" on:click={tryAgain}>Try Again</button>
      <button class="btn primary" on:click={clearGame}>Clear</button>
    </div>
  {:else}
    &nbsp;
  {/if}
</div>

<style lang="scss">
  .guessed {
    display: grid;
    gap: 0.25rem;
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: auto;
    @apply w-1/3;
  }
</style>
