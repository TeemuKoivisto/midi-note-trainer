<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import { slide, fade } from 'svelte/transition'

  import type { IconifyIcon } from '@iconify/svelte/dist/OfflineIcon.svelte'

  interface Option {
    key: any
    value: string
    icon?: IconifyIcon
  }
  export let options: readonly Option[],
    id: string | undefined = undefined,
    containerClass: string | undefined = undefined,
    selected: any | undefined = undefined,
    disabled: boolean | undefined = undefined,
    onSelect: (key: any) => boolean

  const DROPDOWN_DURATION = 400

  let containerEl: HTMLElement,
    open = false

  function handleOpen() {
    if (!disabled) {
      open = !open
    }
  }

  function handleSelect(key: Option['key']) {
    open = onSelect(key)
  }
</script>

<div class={`relative ${containerClass || ''}`} {id} bind:this={containerEl}>
  <button
    class={`${$$props.class || ''} open-btn w-full rounded text-justify text-sm hover:bg-[#eee]`}
    class:disabled
    class:open
    title={$$props.title || ''}
    on:click={handleOpen}
  >
    <slot name="value" />
  </button>
  {#if open}
    <button
      transition:fade={{ duration: DROPDOWN_DURATION }}
      class="fixed inset-0 z-20 h-full w-full cursor-default outline-none"
      on:click={handleOpen}
      tabindex="-1"
    />
    <ul
      transition:slide={{ duration: DROPDOWN_DURATION }}
      class={`items-list absolute left-0 z-30 h-64 overflow-y-scroll rounded-b bg-white py-1.5 py-2 text-sm shadow-xl ${
        containerClass || ''
      }`}
    >
      <li>
        <slot name="header" />
      </li>
      {#each options as { key, value, icon }, idx}
        <li>
          <button
            class="h-full w-full px-2 py-1 text-justify hover:bg-[#eee]"
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
      {/each}
    </ul>
  {/if}
</div>

<style lang="postcss">
  @reference "#app.pcss";

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
