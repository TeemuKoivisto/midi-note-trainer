<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'

  interface $$Props extends HTMLInputAttributes {}
  interface $$Events {
    change: Event & { currentTarget: EventTarget & HTMLInputElement }
    input: Event & { currentTarget: EventTarget & HTMLInputElement }
  }
</script>

<input class={`${$$props.class || ''}`} type="checkbox" on:change on:input {...$$props} />

<style lang="scss">
  /** https://moderncss.dev/pure-css-custom-checkbox-style/ */
  input[type='checkbox'] {
    /* Add if not using autoprefixer */
    -webkit-appearance: none;
    /* Remove most all native input styles */
    appearance: none;
    /* For iOS < 15 */
    background-color: var(--form-background);
    transform: translateY(-0.075em);
    display: grid;
    place-content: center;
    position: relative;
    @apply w-[1.15rem] h-[1.15rem] m-0 rounded border border-gray-500;

    &:checked {
      @apply bg-blue-500 border-blue-500;
      &:before {
        transform: scale(1);
      }
    }
    &:before {
      content: '';
      clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
      transform: scale(0);
      transform-origin: bottom left;
      transition: 120ms transform ease-in-out;
      // box-shadow: inset 1em 1em rgba(0, 0, 0, 0.06);
      /* Windows High Contrast Mode */
      background-color: CanvasText;
      @apply w-[0.75rem] h-[0.75rem] bg-white;
    }
    &:after {
      background: transparent;
      content: '';
      opacity: 0;
      position: absolute;
      pointer-events: none;
      @apply h-[1rem] w-[1rem] scale-0 transition-[box-shadow_0.2s,transform_0.2s] rounded-full shadow-[0px_0px_0px_11px_rgba(0,0,0,0.1)];
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
