<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import stop from '@iconify-icons/mdi/stop-circle-outline'

  import { currentGame, gameActions } from '$stores/game'

  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLDivElement> {}

  let { ...rest }: Props = $props()

  function handleClick() {
    gameActions.clearGame()
  }
</script>

<div {...rest} class={`${rest.class || ''}`} class:hidden={!$currentGame}>
  <button
    class="flex items-center justify-center rounded p-1 hover:bg-gray-200"
    onclick={handleClick}><Icon icon={stop} width={32} /></button
  >
</div>

<style lang="postcss">
</style>
