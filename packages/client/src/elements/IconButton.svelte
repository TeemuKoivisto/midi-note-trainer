<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import Icon, { type IconifyIcon } from '@iconify/svelte/dist/OfflineIcon.svelte'

  interface $$Props extends HTMLButtonAttributes {
    icon: IconifyIcon
    size: number
  }
  interface $$Events {
    click: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }
  }

  export let icon: IconifyIcon, size: number
</script>

<button
  {...$$restProps}
  class={`${$$props.class || ''} flex items-center justify-center rounded p-1 hover:bg-gray-200`}
  on:click
>
  <Icon {icon} width={size} />
</button>

<style lang="postcss">
</style>
