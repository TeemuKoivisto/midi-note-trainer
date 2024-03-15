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
  <div class="fixed z-40 w-full h-full top-0 left-0 flex items-center justify-center">
    <button
      transition:fade={{ duration: MODAL_DURATION }}
      class="fixed z-40 inset-0 h-full w-full bg-black bg-opacity-50 outline-none cursor-default"
      on:click={handleOverlayClick}
      tabindex="-1"
    />

    <div
      transition:scale={{ duration: MODAL_DURATION }}
      class="absolute top-4 bottom-0 mb-4 z-50 bg-gray-100 w-11/12 mx-auto rounded-xl shadow-lg overflow-y-auto md:max-w-3xl"
    >
      <div class="relative flex flex-col p-6 text-left bg-gray-100">
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
