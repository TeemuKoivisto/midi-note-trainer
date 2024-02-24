<script lang="ts">
  export let value: { key: string; size?: number; code: number; note: string }

  function sizeClass(size?: number) {
    if (size && Number.isInteger(size)) {
      return `size-${size}`
    } else if (size) {
      return `size-${Math.floor(size)}-${Math.floor(size * 10) - Math.floor(size) * 10}`
    }
    return 'size-1'
  }
</script>

{#if value.key === 'Enter'}
  <li class="m-[0.175rem] mr-0"></li>
{/if}
<li
  class={`${$$props.class || ''} m-[0.175rem] ${sizeClass(value.size)}`}
  class:enter={value.key === 'Enter'}
>
  <button
    class="relative w-full h-full shadow bg-[#ececf1] rounded flex items-center justify-center"
    on:click
  >
    {#if value.key === 'Enter'}
      <div
        class="enter-part bg-[#ececf1] rounded-l absolute top-[-2px] left-[-12px] w-[13px] h-[2.8rem]"
      ></div>
    {/if}
    <div class="absolute top-0 left-0">{value.note}</div>
    <div>{value.key}</div>
  </button>
</li>

<style lang="scss">
  li {
    button {
      border: 2px solid transparent;
      @apply outline-none;
      &:focus {
        border: 2px solid #015fcc;
      }
      &:focus-within .enter-part {
        color: red;
        border-left: 2px solid #015fcc;
        border-top: 2px solid #015fcc;
        border-bottom: 2px solid #015fcc;
      }
      .enter-part:after {
        content: ' ';
        display: block;
        width: 1px;
        position: relative;
        right: -10px;
        bottom: -40px;
        height: 3px;
        @apply bg-[#ececf1];
      }
    }
    &.size-1 {
      grid-column: span 4;
    }
    &.size-1-5 {
      grid-column: span 6;
    }
    &.size-1-7 {
      grid-column: span 7;
    }
    &.size-2 {
      grid-column: span 8;
    }
    &.size-2-2 {
      grid-column: span 9;
    }
    &.size-2-5 {
      grid-column: span 10;
    }
    &.size-3 {
      grid-column: span 12;
    }
    &.enter {
      grid-row-start: 2;
      grid-row-end: 4;
      grid-column-start: 58;
      grid-column-end: 63;
      border-top-left-radius: 0;
    }
  }
</style>
