<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import x from '@iconify-icons/feather/x'

  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    content: Snippet<[{ class: string }]>
    title: string
    hideModal: () => void
  }

  let { content, title, hideModal = () => undefined, ...props }: Props = $props()
</script>

<div
  {...props}
  class={`${props.class || ''} relative flex h-full w-full flex-col space-y-4 p-2 pt-4 focus:outline-none sm:p-4 sm:pt-6`}
>
  <h2
    class="mb-2 flex items-center justify-between pl-1.5 text-3xl font-semibold text-black sm:text-5xl"
  >
    <span>{title}</span>
    <button
      class="flex items-center rounded-full px-2 py-2 text-sm hover:bg-gray-200"
      onclick={hideModal}
    >
      <Icon icon={x} width={24} />
    </button>
  </h2>
  {@render content({ class: 'overflow-y-auto overscroll-contain' })}
</div>

<style lang="postcss">
</style>
