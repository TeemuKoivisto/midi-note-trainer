<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import playIcon from '@iconify-icons/mdi/play-outline'
  // import playIcon from '@iconify-icons/feather/play'

  import Options from '$components/Options.svelte'

  import { gameActions, type GameType } from '$stores/game'

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

  function clearGame() {
    selectedGame = options[0].key
    gameActions.clearGame()
  }
  function play(type: GameType) {
    gameActions.play(type)
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
  }
  function handleSelectGame(key: GameType) {
    selectedGame = key
  }
  function handleQuickPlay(key: GameType) {
    selectedGame = key
    play(key)
  }
  function handleSelectChords(key: ChordsOption) {
    selectedChords = key
  }
</script>

<div class={`${$$props.class || ''}`}>
  <fieldset class="flex flex-col rounded border-2 px-4 py-2 my-4 text-sm">
    <legend class="px-1 text-base">Play</legend>
    <Options class="" />
    <div class="body">
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
              class="px-1 py-1 flex items-center rounded text-[#222] hover:bg-blue-500 hover:text-white"
              on:click={() => handleQuickPlay(key)}
            >
              <Icon icon={playIcon} width={20} />
            </button>
          </li>
        {/each}
      </ul>
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
      <div></div>
      <div class="h-full buttons">
        <div></div>
        <div></div>
        {#if selectedGame}
          <button
            class="flex items-center justify-center btn primary"
            on:click={() => play(selectedGame)}
          >
            <Icon icon={playIcon} width={20} />
            Play
          </button>
        {/if}
        <div></div>
        <div></div>
        <button class="btn hover:bg-gray-200" on:click={clearGame}>Clear</button>
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
