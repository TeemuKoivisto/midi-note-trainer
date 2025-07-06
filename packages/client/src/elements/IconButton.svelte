<script lang="ts">
  import Icon, { type IconifyIcon } from '@iconify/svelte/dist/OfflineIcon.svelte'

  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLButtonElement> {
    icon: IconifyIcon
    size: number
  }

  let { icon, size, ...rest }: Props = $props()
</script>

<button
  {...rest}
  class={`${rest.class || ''} flex items-center justify-center rounded p-1 hover:bg-gray-200`}
>
  <Icon {icon} width={size} />
</button>

<style lang="postcss">
</style>
