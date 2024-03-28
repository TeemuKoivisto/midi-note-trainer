<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'

  interface $$Props extends HTMLInputAttributes {}
  interface $$Events {
    change: Event & { currentTarget: EventTarget & HTMLInputElement }
    input: Event & { currentTarget: EventTarget & HTMLInputElement }
  }

  let inputEl: HTMLInputElement

  function handleKeyDown(ev: KeyboardEvent) {
    if (ev.key === 'Enter') {
      inputEl.click()
    }
  }
</script>

<label class={`${$$props.class || ''} toggle`}>
  <input bind:this={inputEl} {...$$props} type="checkbox" on:change on:keydown={handleKeyDown} />
  <div class="slider"></div>
</label>

<style lang="scss">
  .toggle {
    @apply relative rounded h-[22px] w-[40px] min-w-[40px];
    &:focus-within {
      @apply outline outline-2 ring-1 outline-blue-700;
    }
  }
  input {
    @apply h-0 w-0;
    &:checked + .slider {
      @apply bg-blue-500;
      &:before {
        transform: translateX(110%);
      }
    }
  }
  .slider {
    border-radius: 34px;
    @apply absolute inset-0 cursor-pointer transition-all duration-300 bg-gray-300;
    &:before {
      content: '';
      border-radius: 50%;
      height: 16px;
      width: 16px;
      left: 3px;
      bottom: 3px;
      @apply absolute transition-all duration-300 bg-white;
    }
  }
</style>
