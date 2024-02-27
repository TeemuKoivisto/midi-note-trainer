<script lang="ts">
  import { gameActions, gameOptions, guessState } from '$stores/game'
  import { played } from '$stores/score'

  import { getNote, getNoteAbsolute } from '@/chords-and-scales'

  import { GuessChords, GuessKeys, GuessNotes } from '@/games'
  import type { GameInstance } from '@/games'

  export let game: GameInstance | undefined

  function nextGuess() {
    gameActions.nextGuess()
  }
  function autoplay() {
    gameActions.setOptionValue('autoplay', true)
    gameActions.nextGuess()
  }
  function tryAgain() {
    game && gameActions.play(game.type)
  }
  function clearGame() {
    gameActions.clearGame()
  }
</script>

<div class={`${$$props.class || ''} flex flex-col`}>
  {#if game instanceof GuessNotes && ($guessState === 'correct' || $guessState === 'wrong')}
    <div class="guessed min-h-[3.25rem]">
      <span>Target:</span>
      <span>{getNoteAbsolute(getNote(game.latestGuess.target || 0))}</span>
      <span></span>
      <span>Guessed:</span>
      <span>{getNoteAbsolute(getNote(game.latestGuess.guessed || 0))}</span>
      <span></span>
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
  {:else if game instanceof GuessKeys && ($guessState === 'correct' || $guessState === 'wrong')}
    <div class="guessed min-h-[3.25rem]">
      <span>Target:</span>
      <span>{game.latestGuess.target}</span>
      <span></span>
      <span>Guessed:</span>
      <span>{game.latestGuess.guessed}</span>
      <span></span>
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
  {:else if game instanceof GuessChords && ($guessState === 'correct' || $guessState === 'wrong')}
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
  {:else if game && $guessState === 'ended'}
    <div class="min-h-[3.25rem]">
      <span>Result: [{game.correct} / {game.sampled.length}]</span>
      <span>avg {game.avgTime}s</span>
    </div>
    <div class="mt-2 h-8">
      <button class="btn primary" on:click={tryAgain}>Try Again</button>
      <button class="btn primary" on:click={clearGame}>Clear</button>
    </div>
  {:else if $played.length > 0}
    <div class="min-h-[3.25rem]">
      <span>Played: </span>
      {#each $played as note}
        <span class="mx-1">{getNoteAbsolute(note)}</span>
      {/each}
    </div>
    <div class="mt-2 h-8">&nbsp;</div>
  {:else}
    <div class="min-h-[3.25rem]">&nbsp;</div>
    <div class="mt-2 h-8">&nbsp;</div>
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
