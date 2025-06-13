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

<input
  bind:this={inputEl}
  type="checkbox"
  on:change
  on:input
  on:keydown={handleKeyDown}
  {...$$props}
/>

<style lang="postcss">
  @reference "#app.pcss";

  /** https://moderncss.dev/pure-css-custom-checkbox-style/ */
  input[type='checkbox'] {
    /* Add if not using autoprefixer */
    -webkit-appearance: none;
    /* Remove most all native input styles */
    appearance: none;
    /* For iOS < 15 */
    background-color: transparent;
    transform: translateY(-0.075em);
    display: grid;
    place-content: center;
    position: relative;
    @apply m-0 h-4 w-4 rounded-sm border border-gray-500;

    &:checked {
      @apply border-blue-500 bg-blue-500;
      &:before {
        transform: scale(1);
      }
    }
    &:before {
      clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
      content: '';
      transform: scale(0);
      transform-origin: bottom left;
      transition: 120ms transform ease-in-out;
      /* Windows High Contrast Mode */
      background-color: CanvasText;
      @apply h-[0.65rem] w-[0.65rem] bg-white;
    }
    &:after {
      background: transparent;
      content: '';
      opacity: 0;
      position: absolute;
      pointer-events: none;
      top: -1px;
      left: -1px;
      @apply h-4 w-4 scale-0 rounded-full shadow-[0px_0px_0px_11px_rgba(0,0,0,0.1)] transition-[box-shadow_0.2s,transform_0.2s];
    }
    &:focus-visible {
      @apply outline-none;
      &:after {
        @apply scale-100 opacity-50;
      }
    }
    &:disabled {
      cursor: not-allowed;
    }
  }
</style>
