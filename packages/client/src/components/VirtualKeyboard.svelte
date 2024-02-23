<script lang="ts">
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
    { key: 'Backspace', code: 1, note: '' }
  ]
  const qwertyKeys = [
    { key: 'Tab', code: 1, note: '' },
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
    { key: 'Enter', code: 1, note: '' }
  ]
  const asdfKeys = [
    { key: 'Caps', code: 1, note: '' },
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
    { key: "'", code: 1, note: '' },
    { key: 'Enter', code: 1, note: '' }
  ]
  const zxcvKeys = [
    { key: 'Shift', code: 1, note: '' },
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
    { key: 'Shift', code: 1, note: '' }
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
      <label class="font-bold mr-4" for="middle-row">Two rows</label>
      <input class="h-[20px]" id="middle-row" type="checkbox" bind:checked={twoRows} />
    </div>
  </div>
  <div class="flex flex-col gap-1">
    <ul class="number-row">
      {#each numberKeys as key}
        <li>{key.key}</li>
      {/each}
    </ul>
    <ul class="qwerty-row">
      {#each qwertyKeys as key}
        <li class="relative">
          <div class="absolute top-0 left-0">{key.note}</div>
          <div>{key.key}</div>
        </li>
      {/each}
    </ul>
    <ul class="asdf-row">
      {#each asdfKeys as key}
        <li class="relative">
          <div class="absolute top-0 left-0">{key.note}</div>
          <div>{key.key}</div>
        </li>
      {/each}
    </ul>
    <ul class="zxcv-row">
      {#each zxcvKeys as key}
        <li>{key.key}</li>
      {/each}
    </ul>
  </div>
</div>

<style lang="scss">
  ul {
    @apply gap-1 h-12;
  }
  .number-row {
    display: grid;
    grid-template-columns: repeat(13, 1fr) 2.5fr;
    grid-template-rows: auto;
  }
  .qwerty-row {
    display: grid;
    grid-template-columns: 1.5fr repeat(12, 1fr) 2fr;
    grid-template-rows: auto;
  }
  .asdf-row {
    display: grid;
    grid-template-columns: 2fr repeat(12, 1fr) 1.5fr;
    grid-template-rows: auto;
  }
  .zxcv-row {
    display: grid;
    grid-template-columns: 1.5fr repeat(11, 1fr) 3fr;
    grid-template-rows: auto;
  }
  li {
    @apply bg-gray-100 rounded flex items-center justify-center;
  }
</style>
