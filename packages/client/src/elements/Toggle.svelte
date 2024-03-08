<script lang="ts">
  export let checked: boolean

  let inputEl: HTMLInputElement

  function handleKeyDown(ev: KeyboardEvent) {
    if (ev.key === 'Enter') {
      inputEl.click()
    }
  }
</script>

<label class={`${$$props.class || ''} toggle`}>
  <input bind:this={inputEl} {checked} type="checkbox" on:change on:keydown={handleKeyDown} />
  <div class="slider"></div>
</label>

<style lang="scss">
  .toggle {
    @apply relative rounded h-[26px] w-[48px];
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
      height: 20px;
      width: 20px;
      left: 3px;
      bottom: 3px;
      @apply absolute transition-all duration-300 bg-white;
    }
  }
</style>
