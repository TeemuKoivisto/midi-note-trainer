<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import playIcon from '@iconify-icons/mdi/play-outline'
  // import playIcon from '@iconify-icons/feather/play'
  import stop from '@iconify-icons/mdi/stop-circle-outline'

  import GameOptions from '$components/play/GameOptions.svelte'

  import {
    currentGame,
    gameActions,
    gameOptions,
    guessState,
    selectedChords,
    type SelectedChord
  } from '$stores/game'

  import type { GameType } from '@/games'

  const options: { key: GameType; value: string }[] = [
    {
      key: 'notes',
      value: 'Play Notes'
    },
    {
      key: 'pitches',
      value: 'Guess Pitches'
    },
    {
      key: 'keys-major',
      value: 'Guess Major Keys'
    },
    {
      key: 'keys-minor',
      value: 'Guess Minor Keys'
    },
    {
      key: 'chords-write',
      value: 'Write Chords'
    },
    {
      key: 'chords-play',
      value: 'Play Chords'
    },
    {
      key: 'chords-diatonic',
      value: 'Play Scale Trichords'
    }
  ]
  let selectedGame = options[4].key

  type ChordsOption = 'maj-m' | 'selected' | 'all'
  $: showQuit = !!$currentGame && $guessState !== 'ended'
  $: selected = $selectedChords.reduce((acc, cur) => (cur.selected ? acc + 1 : acc), 0)
  $: chordsOptions = [
    {
      key: 'maj-m',
      value: 'Major/Minor'
    },
    {
      key: 'seventh',
      value: 'Seventh'
    },
    {
      key: 'selected',
      value: `Selected ${selected} chords`
    },
    {
      key: 'all',
      value: 'All'
    }
  ] as { key: ChordsOption; value: string }[]
  let chordsSelection = 'maj-m'
  let count = $gameOptions.count || ''
  let waitSeconds = $gameOptions.waitSeconds || ''

  gameOptions.subscribe(v => {
    count = v.count || ''
    waitSeconds = v.waitSeconds || ''
  })

  function play(e: MouseEvent, type: GameType) {
    if (type === 'chords-write' || type === 'chords-play' || type === 'chords-diatonic') {
      let chords: SelectedChord[] = []
      if (chordsSelection === 'selected') {
        chords = $selectedChords.filter(c => c.selected)
      } else if (chordsSelection === 'all') {
        chords = $selectedChords
      } else if (chordsSelection === 'maj-m') {
        chords = $selectedChords.filter(c => c.suffixes[0] === 'maj' || c.suffixes[0] === 'm')
      } else if (chordsSelection === 'seventh') {
        chords = $selectedChords.filter(
          c =>
            c.suffixes[0] === 'maj7' ||
            c.suffixes[0] === 'm7' ||
            c.suffixes[0] === '7' ||
            c.suffixes[0] === 'dim7' ||
            c.suffixes[0] === 'aug7'
        )
      }
      gameActions.play(type, { chords })
    } else {
      gameActions.play(type, undefined)
    }
    // Blur the button so that pressing Space or Enter wont allow generating bazillion new games
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.blur()
    }
    setTimeout(() => {
      // Scroll to the bottom to center the Score better
      window.scrollTo(0, document.body.scrollHeight)
    })
  }
  function handleSelectGame(key: GameType) {
    selectedGame = key
  }
  function handleQuickPlay(e: MouseEvent, key: GameType) {
    selectedGame = key
    play(e, key)
  }
  function handleSelectChords(key: ChordsOption) {
    chordsSelection = key
  }
  function clearGame() {
    gameActions.clearGame(true)
  }
  function handleClickPlay(e: MouseEvent) {
    if (showQuit) {
      gameActions.clearGame()
    } else {
      play(e, selectedGame)
    }
  }
</script>

<fieldset class={`${$$props.class || ''} flex flex-col rounded border-2 px-4 py-2 text-sm`}>
  <legend class="px-1 text-base w-fit">Play</legend>
  <div class="body pb-2 h-full">
    <ul class="games">
      {#each options as { key, value }}
        <li class="flex">
          <button
            class="px-2 py-1 mr-1 flex items-center w-full h-full rounded text-left hover:bg-[#eee]"
            class:selected={key === selectedGame}
            on:click={() => handleSelectGame(key)}
          >
            {value}
          </button>
          <button
            class="px-1 py-1 flex items-center justify-center rounded text-[#222] hover:bg-blue-500 hover:text-white"
            on:click={e => handleQuickPlay(e, key)}
          >
            <Icon icon={playIcon} width={20} />
          </button>
        </li>
      {/each}
    </ul>
    <div class="options">
      {#if selectedGame === 'chords-write' || selectedGame === 'chords-play'}
        <ul>
          {#each chordsOptions as { key, value }}
            <li>
              <button
                class="px-2 py-1 mr-1 flex items-center w-full h-full rounded text-left hover:bg-[#eee]"
                class:selected={key === chordsSelection}
                on:click={() => handleSelectChords(key)}>{value}</button
              >
            </li>
          {/each}
        </ul>
      {/if}
    </div>
    <GameOptions class="game-options" />
    <div class="h-full flex flex-col justify-end">
      <button class="w-full btn hover:bg-gray-200" on:click={clearGame}>Reset</button>
      <button
        class="w-full mt-2 flex items-center justify-center btn"
        class:primary={showQuit}
        class:success={!showQuit}
        on:click={handleClickPlay}
      >
        <Icon class="mr-1" icon={showQuit ? stop : playIcon} width={20} />
        {showQuit ? 'Quit' : 'Play'}
      </button>
    </div>
  </div>
</fieldset>

<style lang="scss">
  ul {
    li + li {
      @apply mt-1;
    }
    .selected {
      @apply bg-gray-200;
    }
  }
  .body {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: 5fr 4fr 4fr;
    grid-template-rows: 1fr 1fr;
    .games {
      grid-row-end: span 2;
    }
    .options {
      grid-row-end: span 2;
    }
    @media (width <= 475px) {
      grid-template-columns: 1fr 1fr;
      :global(.game-options) {
        @apply px-2;
      }
    }
  }
  .buttons {
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;
    align-items: center;
  }
  .error {
    @apply text-xs text-red-500;
  }
</style>
