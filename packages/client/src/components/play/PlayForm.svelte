<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import playIcon from '@iconify-icons/mdi/play-outline'
  // import playIcon from '@iconify-icons/feather/play'

  import Options from '$components/play/Options.svelte'

  import { gameActions, gameOptions } from '$stores/game'

  import type { GameType } from '@/games'

  const options: { key: GameType; value: string }[] = [
    {
      key: 'notes',
      value: 'Guess Notes'
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
      value: 'Play Diatonic Triads'
    }
  ]
  let selectedGame = options[4].key
  type ChordsOption = 'maj-m' | 'all'
  const chordsOptions: { key: ChordsOption; value: string }[] = [
    {
      key: 'maj-m',
      value: 'maj, m'
    },
    {
      key: 'all',
      value: 'all'
    }
  ]
  let selectedChords = chordsOptions[0].key
  let count = $gameOptions.count || ''
  let waitSeconds = $gameOptions.waitSeconds || ''

  gameOptions.subscribe(v => {
    count = v.count || ''
    waitSeconds = v.waitSeconds || ''
  })

  function clearGame() {
    selectedGame = options[0].key
    gameActions.clearGame(true)
  }
  function play(e: MouseEvent, type: GameType) {
    gameActions.play(type)
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
    selectedChords = key
  }
  function handleCountChanged({
    currentTarget: { value }
  }: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    let int
    try {
      int = parseInt(value)
      if (int <= 0) {
        int = 1
      }
      gameActions.setOptionValue('count', int)
    } catch (err) {
      count = $gameOptions.count
    }
  }
  function handleWaitChanged({
    currentTarget: { value }
  }: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    let int
    try {
      int = parseInt(value)
      if (int < 0) {
        int = 0
      }
      gameActions.setOptionValue('waitSeconds', int)
    } catch (err) {
      waitSeconds = $gameOptions.waitSeconds
    }
  }
</script>

<div class={`${$$props.class || ''}`}>
  <fieldset class="flex flex-col rounded border-2 px-4 py-2 my-4 text-sm">
    <legend class="px-1 text-base">Play</legend>
    <Options class="pb-2" />
    <div class="body mt-2">
      <ul class="options">
        {#each options as { key, value }}
          <li class="flex">
            <button
              class="px-2 py-1 mr-1 flex items-center w-full h-full rounded hover:bg-[#eee]"
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
      <div class="flex flex-col justify-between h-full">
        <ul>
          <li class="flex items-center justify-between">
            <label class="font-bold" for="guess-count">Count</label>
            <input
              class="h-[20px] w-16"
              id="guess-count"
              type="number"
              bind:value={count}
              on:input={handleCountChanged}
            />
          </li>
          <li class="flex items-center justify-between mr-12">
            <label class="font-bold" for="duplicates">Duplicates</label>
            <input
              class="h-[20px]"
              id="duplicates"
              type="checkbox"
              bind:checked={$gameOptions.duplicates}
            />
          </li>
          <li class="flex items-center justify-between mr-12">
            <label class="font-bold" for="autoplay">Autoplay</label>
            <input
              class="h-[20px]"
              id="autoplay"
              type="checkbox"
              bind:checked={$gameOptions.autoplay}
            />
          </li>
          <li class="flex items-center justify-between">
            <label class="font-bold" for="wait-ms">Wait seconds</label>
            <input
              class="h-[20px] w-16"
              id="wait-ms"
              type="number"
              bind:value={waitSeconds}
              on:input={handleWaitChanged}
            />
          </li>
        </ul>
        <div>
          <button class="w-full btn-sm hover:bg-gray-200" on:click={clearGame}>Reset</button>
        </div>
      </div>
      <div>
        {#if selectedGame === 'chords-write' || selectedGame === 'chords-play'}
          <ul>
            {#each chordsOptions as { key, value }}
              <li>
                <button
                  class="px-2 py-1 mr-1 flex items-center w-full h-full rounded hover:bg-[#eee]"
                  class:selected={key === selectedChords}
                  on:click={() => handleSelectChords(key)}>{value}</button
                >
              </li>
            {/each}
          </ul>
        {/if}
      </div>
      <div class="h-full flex flex-col justify-between">
        <div class="h-[1.75rem]"></div>
        <div>
          {#if selectedGame}
            <button
              class="w-full flex items-center justify-center btn primary"
              on:click={e => play(e, selectedGame)}
            >
              <Icon icon={playIcon} width={20} />
              Play
            </button>
          {/if}
        </div>
        <div>
          <button class="w-full btn hover:bg-gray-200" on:click={clearGame}>Clear</button>
        </div>
      </div>
    </div>
  </fieldset>
</div>

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
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: auto;
    align-items: center;
    @media (width <= 475px) {
      grid-template-columns: 1fr 1fr;
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
