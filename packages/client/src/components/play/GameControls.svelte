<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import check from '@iconify-icons/mdi/check'
  import close from '@iconify-icons/mdi/close'

  import { gameActions, gameOptions, guessState } from '$stores/game'
  import { inputState, keyboardActions } from '$stores/keyboard'
  import { scaleData, played } from '$stores/score'

  import { getNoteAbsolute, type ScaleNote } from '@/chords-and-scales'

  import { GuessChords, GuessKeys, GuessNotes } from '@/games'
  import type { GameInstance } from '@/games'

  export let game: GameInstance | undefined

  function nextGuess() {
    const state = $inputState
    if (state?.isEmpty) {
      gameActions.nextGuess()
    } else {
      const e = new KeyboardEvent('down', { code: 'Enter' })
      const parsed = keyboardActions.handleInput(e.code, e.key, e.shiftKey)
      if (
        parsed &&
        (parsed.e === 'guessed-key' || parsed.e === 'guessed-chord' || parsed.e === 'guessed-note')
      ) {
        // @TODO lol, needs a better input management system
        state?.submit(parsed)
      }
    }
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
  function getNoteStr(midi: number) {
    const note = $scaleData.notesMap.get(midi % 12) as ScaleNote
    return getNoteAbsolute({ midi, ...note })
  }
</script>

<div class={`${$$props.class || ''} min-h-[3.25rem]`}>
  {#if game instanceof GuessNotes && ($guessState === 'correct' || $guessState === 'wrong')}
    <div class="guessed">
      <span>Target:</span>
      <span>{getNoteStr(game.latestGuess.target || 0)}</span>
      <span></span>
      <span class="relative">
        <div class="absolute left-[-2rem] p-1">
          <Icon icon={$guessState === 'correct' ? check : close} width={16} />
        </div>
        Guessed:
      </span>
      <span>{getNoteStr(game.latestGuess.guessed || 0)}</span>
      <span></span>
    </div>
  {:else if game instanceof GuessKeys && ($guessState === 'correct' || $guessState === 'wrong')}
    <div class="guessed">
      <span>Target:</span>
      <span>{game.latestGuess.target}</span>
      <span></span>
      <span class="relative">
        <div class="absolute left-[-2rem] p-1">
          <Icon icon={$guessState === 'correct' ? check : close} width={16} />
        </div>
        Guessed:
      </span>
      <span>{game.latestGuess.guessed}</span>
      <span></span>
    </div>
  {:else if game instanceof GuessChords && ($guessState === 'correct' || $guessState === 'wrong')}
    <div class="guessed">
      <span>Target:</span>
      <span>{game.latestGuess.target?.chord}</span>
      <span>{game.latestGuess.target?.notes.map(n => n.note).join(' ')}</span>
      <span class="relative">
        <div class="absolute left-[-2rem] p-1">
          <Icon icon={$guessState === 'correct' ? check : close} width={16} />
        </div>
        Guessed:
      </span>
      <span>
        {game.latestGuess.guessed?.chord}
      </span>
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
  }
</style>
