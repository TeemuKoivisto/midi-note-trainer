<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'

  type Props = Exclude<HTMLInputAttributes, 'keydown'> & {
    containerClass?: string
  }

  let { containerClass, ...rest }: Props = $props()

  let inputEl: HTMLInputElement

  function handleKeyDown(ev: KeyboardEvent) {
    if (ev.key === 'Enter') {
      inputEl.click()
    }
  }
</script>

<label class={`${containerClass || ''} toggle`}>
  <input {...rest} bind:this={inputEl} type="checkbox" onkeydown={handleKeyDown} />
  <div class="slider"></div>
</label>

<style lang="postcss">
  @reference "#app.pcss";

  .toggle {
    @apply relative h-[22px] w-[40px] min-w-[40px] rounded;
    &:focus-within {
      @apply outline outline-2 outline-blue-700 ring-1;
    }
  }
  input {
    @apply h-0 w-0 appearance-none bg-transparent;
    &:checked + .slider {
      @apply bg-blue-500;
      &:before {
        transform: translateX(110%);
      }
    }
  }
  .slider {
    border-radius: 34px;
    @apply absolute inset-0 cursor-pointer bg-gray-300 transition-all duration-300;
    &:before {
      content: '';
      border-radius: 50%;
      height: 16px;
      width: 16px;
      left: 3px;
      bottom: 3px;
      @apply absolute bg-white transition-all duration-300;
    }
  }
</style>
