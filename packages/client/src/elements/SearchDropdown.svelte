<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { slide, fade } from 'svelte/transition'

  import type { IconifyIcon } from '@iconify/svelte/dist/OfflineIcon.svelte'

  type Key = string | number
  interface Option {
    key: Key
    value: string
    icon?: IconifyIcon
  }
  export let options: readonly Option[],
    id: string | undefined = undefined,
    containerClass: string | undefined = undefined,
    selected: string,
    disabled: boolean | undefined = undefined,
    onSelect: (key: Key) => boolean

  const DROPDOWN_DURATION = 400

  let containerEl: HTMLElement,
    open = false,
    input = selected,
    filtered = options.map(_ => false)

  $: {
    input = selected
  }
  $: {
    filtered = options.map(_ => false)
  }

  function handleOpen() {
    if (!disabled) {
      open = !open
    }
  }
  function handleInput(
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement
    }
  ) {
    filtered = options.map(
      v => !v.value.toLowerCase().includes(e.currentTarget.value.toLowerCase())
    )
  }
  function handleCancel() {
    input = selected
    open = false
    filtered = options.map(_ => false)
  }
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      const first = filtered.findIndex(v => !v)
      if (input === selected) {
        handleCancel()
      } else if (first > -1) {
        open = onSelect(options[first].key)
      }
      if (!open) {
        filtered = options.map(_ => false)
        if (e.currentTarget instanceof HTMLElement) {
          e.currentTarget.blur()
        }
      }
    } else if (e.key === 'Escape') {
      handleCancel()
      if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.blur()
      }
    }
  }
  function handleSelect(key: Option['key']) {
    open = onSelect(key)
  }
</script>

<div class={`relative ${containerClass || ''}`} {id} bind:this={containerEl}>
  <input
    class={`${$$props.class || ''} open-btn w-full text-justify text-sm rounded`}
    class:disabled
    class:open
    title={$$props.title || ''}
    bind:value={input}
    on:click={handleOpen}
    on:focus={() => (open = true)}
    on:input={handleInput}
    on:keydown={handleKeyDown}
  />
  {#if open}
    <button
      transition:fade={{ duration: DROPDOWN_DURATION }}
      class="fixed z-20 inset-0 h-full w-full outline-none cursor-default"
      on:click={handleCancel}
      tabindex="-1"
    />
    <ul
      transition:slide={{ duration: DROPDOWN_DURATION }}
      class={`items-list bg-white py-1.5 py-2 w-48 max-h-64 overflow-y-scroll text-sm absolute left-0 z-30 rounded-b shadow-xl ${
        containerClass || ''
      }`}
    >
      <li>
        <slot name="header" />
      </li>
      {#each options as { key, value, icon }, idx}
        {#if !filtered[idx]}
          <li>
            <button
              class="px-2 py-1 text-justify w-full h-full hover:bg-[#eee]"
              class:selected={key === selected}
              on:click={() => handleSelect(key)}
            >
              {#if icon}
                <Icon class="mr-2" {icon} width={16} />
              {:else}
                <div class="w-[24px]"></div>
              {/if}
              <div>
                {value}
              </div>
            </button>
          </li>
        {/if}
      {/each}
    </ul>
  {/if}
</div>

<style lang="scss">
  .items-list {
    box-shadow: 0 2px 6px 2px rgba(60, 64, 67, 0.15);
  }
  .open-btn {
    &.disabled {
      cursor: initial;
      opacity: 0.5;
      &:hover {
        background-color: initial;
      }
    }
  }
  .selected {
    @apply bg-gray-200;
  }
</style>
