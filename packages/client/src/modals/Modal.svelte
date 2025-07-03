<script lang="ts">
  import { fade, scale } from 'svelte/transition'
  import { onMount } from 'svelte'

  import Introduction from './Introduction.svelte'
  import ModalContent from './ModalContent.svelte'

  import { openModal, modals, modalActions } from '$stores/modal'

  const MODAL_DURATION = 300
  let originalFocusedEl: HTMLElement
  let modalContainer: HTMLElement
  let focusableElements: HTMLElement[]
  let contentEl: HTMLDivElement

  onMount(() => {
    // Capture the currently focused element to restore focus when modal closes
    if (document.activeElement instanceof HTMLElement) {
      originalFocusedEl = document.activeElement
    }
    document.querySelector('html')?.classList.add('scroll-lock')
    return () => {
      originalFocusedEl?.focus()
      document.querySelector('html')?.classList.remove('scroll-lock')
    }
  })

  function handleKeyDown(e: KeyboardEvent) {
    if ($openModal && e.key === 'Escape') {
      modalActions.close()
    }
  }

  function handleOverlayClick() {
    modalActions.close()
  }

  function updateFocusableElements() {
    if (modalContainer) {
      focusableElements = Array.from(
        modalContainer.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ) as HTMLElement[]
    }
  }

  function handleTabKey(e: KeyboardEvent) {
    if (!focusableElements.length) return
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    if (e.shiftKey) {
      // Shift + Tab: move backwards
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab: move forwards
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }

  function handleModalKeyDown(e: KeyboardEvent) {
    if (e.key === 'Tab') {
      handleTabKey(e)
    }
  }

  function clickContainer(e: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }) {
    // Close on clicks to backdrop
    if (!e.composedPath().includes(contentEl)) {
      modalActions.close()
    }
  }
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if $openModal}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center"
    role="dialog"
    tabindex="-1"
    transition:fade={{ duration: MODAL_DURATION }}
    bind:this={modalContainer}
    onkeydown={handleModalKeyDown}
    onfocusin={updateFocusableElements}
  >
    <button
      class="absolute inset-0 bg-black/50"
      aria-label="Close modal"
      onclick={handleOverlayClick}
    ></button>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      transition:scale={{ duration: MODAL_DURATION }}
      class="absolute bottom-0 top-0 mx-auto flex items-center justify-center overflow-y-auto sm:bottom-4 sm:top-4 md:max-w-3xl"
      onclick={clickContainer}
    >
      <div
        class="relative flex h-full w-screen max-w-2xl bg-white shadow-lg sm:w-full sm:min-w-[512px] sm:rounded-xl"
        bind:this={contentEl}
      >
        {#if $openModal === 'introduction'}
          <ModalContent title="Introduction" hideModal={() => modalActions.close()}>
            {#snippet content(props)}
              <Introduction
                {...props}
                params={$modals.introduction}
                hideModal={() => modalActions.close()}
              />
            {/snippet}
          </ModalContent>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style lang="postcss">
  /* Additional styles can be added here if needed */
</style>
