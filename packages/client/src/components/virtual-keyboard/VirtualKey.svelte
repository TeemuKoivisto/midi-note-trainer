<script lang="ts">
  import { getOctave } from '@/chords-and-scales'

  import { midiRange } from '$stores/inputs'
  import { capturingHotkeys, rows } from '$stores/keyboard'

  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLLIElement> {
    rowIndex: number
    keyIndex: number
  }

  let { rowIndex, keyIndex, ...rest }: Props = $props()

  let value = $derived($rows[rowIndex].keys[keyIndex])
  let octave = $derived(
    value.note ? getOctave({ midi: value.note.semitones + $midiRange[0], flats: 0, sharps: 0 }) : 0
  )
  let captured = $derived(
    $capturingHotkeys &&
      $capturingHotkeys.rowIndex === rowIndex &&
      $capturingHotkeys.nextIndex === keyIndex
  )
  let size = $state(1)

  $effect(() => {
    if (value.key === '{bksp}') {
      size = 2
    } else if (value.key === '{tab}') {
      size = 1.5
    } else if (value.key === '{enter}') {
      size = 2
    } else if (value.key === '{lock}') {
      size = 1.75
    } else if (value.key === '{shift}' && keyIndex === 0) {
      size = 1.5
    } else if (value.key === '{shift}') {
      size = 2.5
    } else {
      size = 1
    }
  })

  function sizeClass(size?: number) {
    if (size && Number.isInteger(size)) {
      return `size-${size}`
    } else if (size) {
      return `size-${Math.floor(size)}-${Math.floor(size * 10) - Math.floor(size) * 10}`
    }
    return 'size-1'
  }
  function formatValue(key: string) {
    if (key === '{empty}') {
      return ''
    } else if (key === '{bksp}') {
      return 'Backspace'
    } else if (key === '{tab}') {
      return 'Tab'
    } else if (key === '{enter}') {
      return 'Enter'
    } else if (key === '{lock}') {
      return 'Capslock'
    } else if (key === '{shift}') {
      return 'Shift'
    } else {
      return key
    }
  }
</script>

{#if value.key === '{enter}'}
  <li class="m-[0.175rem] mr-0"></li>
{/if}
<li
  {...rest}
  class={`${rest.class || ''} m-[0.175rem] ${sizeClass(size)} h-auto w-auto min-w-[32px]`}
  class:enter={value.key === '{enter}'}
  class:captured
>
  <button
    class="relative flex h-full w-full justify-center rounded bg-[#ececf1] shadow"
    class:items-center={!value.note}
    class:items-end={value.note}
  >
    {#if value.key === '{enter}'}
      <div
        class="enter-part absolute left-[-12px] top-[-2px] h-[2.8rem] w-[13px] rounded-l bg-[#ececf1]"
      ></div>
    {/if}
    {#if value.note}
      <div class="absolute left-0 top-0">{value.note.note}{octave}</div>
    {/if}
    <div class="text">
      {formatValue(value.key)}
    </div>
  </button>
</li>

<style lang="postcss">
  @reference "#app.pcss";

  li {
    @media (width <= 656px) {
      font-size: 12px;
    }
    &.captured {
      button {
        border: 2px solid #015fcc;
      }
    }
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
      .text {
        z-index: 1;
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
