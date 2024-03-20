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
    if (game instanceof GuessChords) {
      gameActions.play(game.type, game.opts)
    } else if (game) {
      gameActions.play(game.type, undefined)
    }
  }
  function clearGame() {
    gameActions.clearGame()
  }
</script>

<div class={`${$$props.class || ''} min-h-[3.25rem]`}>
  {#if game instanceof GuessNotes && ($guessState === 'correct' || $guessState === 'wrong')}
    <div class="guessed">
      <span>Target:</span>
      <span>{getNoteAbsolute(getNote(game.latestGuess.target || 0))}</span>
      <span></span>
      <span>Guessed:</span>
      <span>{getNoteAbsolute(getNote(game.latestGuess.guessed || 0))}</span>
      <span></span>
    </div>
  {:else if game instanceof GuessKeys && ($guessState === 'correct' || $guessState === 'wrong')}
    <div class="guessed">
      <span>Target:</span>
      <span>{game.latestGuess.target}</span>
      <span></span>
      <span>Guessed:</span>
      <span>{game.latestGuess.guessed}</span>
      <span></span>
    </div>
  {:else if game instanceof GuessChords && ($guessState === 'correct' || $guessState === 'wrong')}
    <div class="guessed">
      <span>Target:</span>
      <span>{game.latestGuess.target?.chord}</span>
      <span>{game.latestGuess.target?.notes.map(n => n.note).join(' ')}</span>
      <span>Guessed:</span>
      <span>{game.latestGuess.guessed?.chord}</span>
      <span>{game.latestGuess.guessed?.notes.map(n => n.note).join(' ')}</span>
    </div>
  {:else if game && $guessState === 'ended'}
    <div class="flex">
      <span>Result:</span>
      <span class="mx-2">[{game.correct} / {game.sampled.length}]</span>
      <span>avg {game.avgTime}s</span>
    </div>
  {:else if $played.length > 0}
    <div>
      <span>Played: </span>
      {#each $played as note}
        <span class="mx-1">{getNoteAbsolute(note)}</span>
      {/each}
    </div>
  {:else}
    &nbsp;
  {/if}
</div>
<div class="mt-2 h-8 flex items-center">
  {#if game && $guessState === 'ended'}
    <button class="btn primary mr-1" on:click={tryAgain}>Try Again</button>
    <button class="btn primary" on:click={clearGame}>Clear</button>
  {:else if game && $gameOptions.autoplay}
    <button class="btn primary" on:click={() => gameActions.setOptionValue('autoplay', false)}
      >Stop autoplay</button
    >
  {:else if game}
    <button class="btn primary mr-1" on:click={nextGuess}>Next</button>
    <button class="btn primary" on:click={autoplay}>Autoplay</button>
  {:else}
    &nbsp;
  {/if}
</div>

<style lang="scss">
  .guessed {
    display: grid;
    gap: 0.25rem;
    grid-template-columns: 1fr 1fr 2fr;
    grid-template-rows: auto;
    @apply w-[28rem];
  }
</style>