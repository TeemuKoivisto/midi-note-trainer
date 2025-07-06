<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { slide, fade } from 'svelte/transition'

  import type { IconifyIcon } from '@iconify/svelte/dist/OfflineIcon.svelte'
  import type { HTMLInputAttributes } from 'svelte/elements'
  import type { Snippet } from 'svelte'

  type Props = Exclude<HTMLInputAttributes, 'onfocus' | 'oninput' | 'onkeydown'> & {
    header?: Snippet<[{ class: string }]>
    options: readonly Option[]
    containerClass?: string
    selected?: string
    onSelect: (key: Key) => boolean
  }

  type Key = string | number
  interface Option {
    key: Key
    value: string
    icon?: IconifyIcon
  }

  const DROPDOWN_DURATION = 400

  let { header, containerClass, options, selected, onSelect, ...rest }: Props = $props()
  let containerEl: HTMLElement
  let open = $state(false)
  let input = $derived(selected)
  let filtered = $state(options.map(_ => false))

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

<div class={`search-dropdown width relative ${containerClass || ''}`} bind:this={containerEl}>
  <input
    {...rest}
    class={`${rest.class || ''} open-btn rounded text-justify text-sm`}
    class:open
    bind:value={input}
    onfocus={() => (open = true)}
    oninput={handleInput}
    onkeydown={handleKeyDown}
  />
  {#if open}
    <button
      transition:fade={{ duration: DROPDOWN_DURATION }}
      class="fixed inset-0 z-20 h-full w-full cursor-default outline-none"
      onclick={handleCancel}
      aria-label="Overlay"
      tabindex="-1"
    ></button>
    <ul
      transition:slide={{ duration: DROPDOWN_DURATION }}
      class="items-list width absolute left-0 z-30 max-h-64 overflow-y-scroll rounded-b bg-white py-1.5 py-2 text-sm shadow-xl"
    >
      {#if header}
        <li>
          {@render header({ class: '' })}
        </li>
      {/if}
      {#each options as { key, value, icon }, idx}
        {#if !filtered[idx]}
          <li>
            <button
              class="h-full w-full px-2 py-1 text-justify hover:bg-[#eee]"
              class:selected={key === selected}
              onclick={() => handleSelect(key)}
              onblur={handleBlur}
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

<style lang="postcss">
  @reference "#app.pcss";

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
