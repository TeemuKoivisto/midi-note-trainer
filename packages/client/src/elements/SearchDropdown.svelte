<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { slide, fade } from 'svelte/transition'

  import type { IconifyIcon } from '@iconify/svelte/dist/OfflineIcon.svelte'
  import type { HTMLInputAttributes } from 'svelte/elements'

  interface $$Props extends HTMLInputAttributes {
    containerClass?: string
    options: readonly Option[]
    selected: string
    onSelect: (key: Key) => boolean
  }

  type Key = string | number
  interface Option {
    key: Key
    value: string
    icon?: IconifyIcon
  }
  const {
    options,
    selected,
    containerClass,
    onSelect,
    class: htmlClass,
    ...props
  } = $$props as $$Props

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

  function handleBlur(e: FocusEvent) {
    open = containerEl.contains(e.relatedTarget as Node | null)
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

<div class={`search-dropdown relative width ${containerClass || ''}`} bind:this={containerEl}>
  <input
    class={`${htmlClass || ''} open-btn text-justify text-sm rounded`}
    class:open
    {...props}
    bind:value={input}
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
      class={`items-list bg-white py-1.5 py-2 max-h-64 overflow-y-scroll text-sm absolute left-0 z-30 rounded-b shadow-xl width`}
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
              on:blur={handleBlur}
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
  :root {
    --search-dropdown-width: 13rem;
  }
  .width {
    width: var(--search-dropdown-width);
  }
  .items-list {
    box-shadow: 0 2px 6px 2px rgba(60, 64, 67, 0.15);
  }
  .open-btn {
    width: var(--search-dropdown-width);
    &:disabled {
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
