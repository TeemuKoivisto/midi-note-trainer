<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import volume from '@iconify-icons/mdi/volume-high'

  import { currentGame, guessState } from '$stores/game'
  import { inputsActions } from '$stores/inputs'
  import { GuessChords, GuessNotes } from '@/games'

  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLDivElement> {}

  let { ...rest }: Props = $props()

  let shown = $derived($currentGame instanceof GuessChords || $currentGame instanceof GuessNotes)

  function replay() {
    const game = $currentGame
    if (game instanceof GuessChords && $guessState === 'waiting') {
      inputsActions.play(
        game.current.notes.map(n => n.midi),
        80
      )
    } else if (game instanceof GuessChords) {
      inputsActions.play(
        (game.latestGuess.target?.notes || []).map(n => n.midi),
        80
      )
    } else if (game instanceof GuessNotes && $guessState === 'waiting') {
      inputsActions.play(game.current, 80)
    } else if (game instanceof GuessNotes) {
      inputsActions.play(game.latestGuess.target || 0, 80)
    }
  }
</script>

<div {...rest} class={`${rest.class || ''}`} class:hidden={!shown}>
  <button
    class="flex items-center justify-center rounded px-1 py-1 hover:bg-gray-200"
    onclick={replay}><Icon icon={volume} width={32} /></button
  >
</div>

<style lang="postcss">
</style>
