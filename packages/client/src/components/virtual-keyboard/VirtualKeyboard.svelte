<script lang="ts">
  import VirtualKey from './VirtualKey.svelte'

  const numberKeys = [
    { key: '§', code: 1, note: '' },
    { key: '1', code: 1, note: '' },
    { key: '2', code: 1, note: '' },
    { key: '3', code: 1, note: '' },
    { key: '4', code: 1, note: '' },
    { key: '5', code: 1, note: '' },
    { key: '6', code: 1, note: '' },
    { key: '7', code: 1, note: '' },
    { key: '8', code: 1, note: '' },
    { key: '9', code: 1, note: '' },
    { key: '0', code: 1, note: '' },
    { key: '+', code: 1, note: '' },
    { key: '`', code: 1, note: '' },
    { key: 'Backspace', size: 2, code: 1, note: '' }
  ]
  const qwertyKeys = [
    { key: 'Tab', size: 1.5, code: 1, note: '' },
    { key: 'q', code: 1, note: '' },
    { key: 'w', code: 1, note: 'C♯' },
    { key: 'e', code: 1, note: 'E♭' },
    { key: 'r', code: 1, note: '' },
    { key: 't', code: 1, note: 'F♯' },
    { key: 'y', code: 1, note: 'G♯' },
    { key: 'u', code: 1, note: 'B♭' },
    { key: 'i', code: 1, note: '' },
    { key: 'o', code: 1, note: 'C♯' },
    { key: 'p', code: 1, note: 'E♭' },
    { key: '/', code: 1, note: '' },
    { key: ';', code: 1, note: '' },
    { key: 'Enter', size: 2, code: 1, note: '' }
  ]
  const asdfKeys = [
    { key: 'Caps', size: 1.75, code: 1, note: '' },
    { key: 'a', code: 1, note: 'C' },
    { key: 's', code: 1, note: 'D' },
    { key: 'd', code: 1, note: 'E' },
    { key: 'f', code: 1, note: 'F' },
    { key: 'g', code: 1, note: 'G' },
    { key: 'h', code: 1, note: 'A' },
    { key: 'j', code: 1, note: 'B' },
    { key: 'k', code: 1, note: 'C' },
    { key: 'l', code: 1, note: 'D' },
    { key: 'ö', code: 1, note: 'E' },
    { key: 'ä', code: 1, note: 'F' },
    { key: "'", code: 1, note: '' }
  ]
  const zxcvKeys = [
    { key: 'Shift', size: 1.5, code: 1, note: '' },
    { key: '<', code: 1, note: '' },
    { key: 'z', code: 1, note: '' },
    { key: 'x', code: 1, note: '' },
    { key: 'c', code: 1, note: '' },
    { key: 'v', code: 1, note: '' },
    { key: 'b', code: 1, note: '' },
    { key: 'n', code: 1, note: '' },
    { key: 'm', code: 1, note: '' },
    { key: ',', code: 1, note: '' },
    { key: '.', code: 1, note: '' },
    { key: '-', code: 1, note: '' },
    { key: 'Shift', size: 2.5, code: 1, note: '' }
  ]

  let middleRow = true
  let twoRows = false
</script>

<div class={`${$$props.class || ''} `}>
  <div class="flex">
    <div class="my-1 flex items-center justify-between mr-12">
      <label class="font-bold mr-4" for="middle-row">Middle-row</label>
      <input class="h-[20px]" id="middle-row" type="checkbox" bind:checked={middleRow} />
    </div>
    <div class="my-1 flex items-center justify-between mr-12">
      <label class="font-bold mr-4" for="two-rows">Two rows</label>
      <input class="h-[20px]" id="two-rows" type="checkbox" bind:checked={twoRows} />
    </div>
  </div>
  <div class="flex flex-col gap-1.5">
    <ul class="keyboard">
      <li class="col-span-2"></li>
      {#each numberKeys as key}
        <VirtualKey value={key} />
      {/each}
      <li class="col-span-2"></li>
      {#each qwertyKeys as key}
        <VirtualKey value={key} />
      {/each}
      <li class="col-span-2"></li>
      {#each asdfKeys as key}
        <VirtualKey value={key} />
      {/each}
      <li class="col-span-2"></li>
      {#each zxcvKeys as key}
        <VirtualKey value={key} />
      {/each}
    </ul>
  </div>
</div>

<style lang="scss">
  ul {
    @apply h-48;
    li {
      @apply m-[0.175rem] shadow bg-[#ececf1] rounded flex items-center justify-center;
    }
  }
  .keyboard {
    display: grid;
    grid-template-columns: 2fr repeat(62, 1fr);
    grid-template-rows: auto;
  }
</style>
