<script lang="ts">
  import { fade, scale } from 'svelte/transition'
  import Introduction from '$modals/Introduction.svelte'

  import { modalActions, openModal, modals } from '$stores/modal'

  const components = {
    introduction: Introduction
  }

  const MODAL_DURATION = 400

  function handleOverlayClick() {
    modalActions.close()
  }
</script>

{#if $openModal}
  <div class="fixed left-0 top-0 z-40 flex h-full w-full items-center justify-center">
    <button
      transition:fade={{ duration: MODAL_DURATION }}
      class="fixed inset-0 z-40 h-full w-full cursor-default bg-black bg-opacity-50 outline-none"
      on:click={handleOverlayClick}
      tabindex="-1"
    />

    <div
      transition:scale={{ duration: MODAL_DURATION }}
      class="absolute bottom-0 top-4 z-50 mx-auto mb-4 w-11/12 overflow-y-auto rounded-xl bg-gray-100 shadow-lg md:max-w-3xl"
    >
      <div class="relative flex flex-col bg-gray-100 p-6 text-left">
        <svelte:component
          this={components[$openModal]}
          params={$modals[$openModal]}
          hideModal={handleOverlayClick}
        />
      </div>
    </div>
  </div>
{/if}

<style>
</style>
