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
  class={`${$$props.class || ''}`}
  type="checkbox"
  on:change
  on:input
  on:keydown={handleKeyDown}
  {...$$props}
/>

<style lang="scss">
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
    @apply w-4 h-4 m-0 rounded-sm border border-gray-500;

    &:checked {
      @apply bg-blue-500 border-blue-500;
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
      // box-shadow: inset 1em 1em rgba(0, 0, 0, 0.06);
      /* Windows High Contrast Mode */
      background-color: CanvasText;
      @apply w-[0.65rem] h-[0.65rem] bg-white;
    }
    &:after {
      background: transparent;
      content: '';
      opacity: 0;
      position: absolute;
      pointer-events: none;
      top: -1px;
      left: -1px;
      @apply h-4 w-4 scale-0 transition-[box-shadow_0.2s,transform_0.2s] rounded-full shadow-[0px_0px_0px_11px_rgba(0,0,0,0.1)];
    }
    &:focus-visible {
      @apply outline-none;
      &:after {
        @apply scale-100 opacity-50;
      }
    }
    &:disabled {
      // --form-control-color: var(--form-control-disabled);
      // color: var(--form-control-disabled);
      cursor: not-allowed;
    }
  }
</style>
