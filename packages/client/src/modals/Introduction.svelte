<script lang="ts">
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte'
  import x from '@iconify-icons/feather/x'

  export let params: undefined
  export let hideModal: () => void = () => undefined
</script>

<div class="absolute top-[1rem] right-[1rem]">
  <button
    class="flex items-center text-sm rounded-full px-2 py-2 hover:bg-gray-200"
    on:click={hideModal}
  >
    <Icon icon={x} width={24} />
  </button>
</div>

<div class="mx-2 mt-2 mb-6 flex flex-col">
  <h2 class="text-5xl my-2 font-semibold text-black">Introduction</h2>
  <article class="w-full mt-2">
    <p>Greetings!</p>
    <p>
      This is a tiny app that I made to help myself and hopefully others to learn music notation.
    </p>
  </article>
</div>

<style lang="scss">
  article {
    text-align: left;
    a {
      font-weight: 600;
      @apply underline text-[#0000ff] break-all;
    }
    hr {
      @apply my-16 border-gray-900;
    }
    p {
      @apply my-4 pl-[2px];
    }
    & > h1 {
      @apply font-sans mt-16 mb-12 text-5xl tracking-tight;
    }
    & > h2 {
      padding-left: 2px;
      @apply font-sans mt-12 mb-8 text-3xl tracking-tight;
    }
    & > h3 {
      padding-left: 3px;
      @apply font-sans mt-12 mb-8 text-xl tracking-tight;
    }
    pre {
      // padding-left: 6px;
      @apply my-4;
      code {
        @apply p-4 block bg-white rounded overflow-y-auto;
      }
    }
  }
</style>
