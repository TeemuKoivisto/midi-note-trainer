<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import stop from '@iconify-icons/mdi/stop-circle-outline'

  import { currentGame, gameActions } from '$stores/game'

  function handleClick() {
    gameActions.clearGame()
  }
</script>

<div class={`${$$props.class || ''}`} class:hidden={!$currentGame}>
  <button
    class="flex items-center justify-center rounded p-1 hover:bg-gray-200"
    on:click={handleClick}><Icon icon={stop} width={32} /></button
  >
</div>

<style lang="scss">
</style>
