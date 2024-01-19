<script lang="ts">
  import type { Note } from '@/types'

  export let target: Note | undefined = undefined,
    played: (Note & { correct: boolean }) | undefined = undefined

  let playedEl: HTMLElement
  let targetEl: HTMLElement

  $: targetEl && updateNoteEl(targetEl, target)
  $: playedEl && updateNoteEl(playedEl, played, played?.correct)

  function updateNoteEl(el: HTMLElement, note?: Note, correct?: boolean) {
    if (note) {
      // console.log('update ', note)
      el.style.display = 'block'
      el.style.bottom = positionNote(note) + 'rem'
      if (el.firstChild) {
        el.firstChild.textContent = `${note.flat ? '♭' : note.sharp ? '♯' : ''}𝅝`
      }
      if (correct !== undefined && correct) {
        el.classList.remove('wrong')
        el.classList.add('correct')
      } else if (correct !== undefined) {
        el.classList.remove('correct')
        el.classList.add('wrong')
      }
      if ((note.value === 60 || note.value === 61) && el.lastChild instanceof HTMLElement) {
        // C4 -> add ledger line through it
        el.lastChild.style.display = 'block'
        if (note.flat || note.sharp) {
          el.lastChild.style.left = '1rem'
        } else {
          el.lastChild.style.left = ''
        }
      } else if (note.value === 81 && el.lastChild instanceof HTMLElement) {
        // >=A5 -> add ledger lines upwards
        el.lastChild.style.display = 'block'
        if (note.flat || note.sharp) {
          el.lastChild.style.left = '1rem'
        } else {
          el.lastChild.style.left = ''
        }
      } else if (el.lastChild instanceof HTMLElement) {
        el.lastChild.style.display = 'none'
      }
    } else {
      el.style.display = 'none'
    }
  }

  function positionNote(note: Note) {
    const stepSize = 0.4272727272727273 // rem
    // bottom: 7.8rem; G5 80
    // bottom: -1.6rem; 22 steps lower
    // 9.4 / 22 = 0.4272727272727273
    const octavesFromC4 = note.octave - 4
    const steps = octavesFromC4 * 7 + note.steps
    // Adjust the position 3.1rem being the value for C4 in G-treble
    return 3.1 + stepSize * steps
  }

  function drawLedgerLines(from: number, to: number) {
    // 81 >= every 3rd step
    // 60 -> middle C
    if (from === 60) {
      // ledgerLines = [{ bottom: '0.02rem' }]
    } else if (from >= 81) {
      // ledgerLines = [{ bottom: '4.97rem' }]
      for (let s = from; s <= to; s += 3) {
        console.log('line', s)
      }
    }
  }
</script>

<section class={`${$$props.class || ''} score pt-12 pb-8`}>
  <div class="staff">
    <div class="line"></div>
    <div class="line"></div>
    <div class="line"></div>
    <div class="line"></div>
    <div class="line"></div>
    <div class="line invisible"></div>
    <div class="line"></div>
    <div class="line"></div>
    <div class="line"></div>
    <div class="line"></div>
    <div class="line"></div>
    <span class="g-clef">𝄞</span>
    <span class="f-clef">𝄢</span>
    <div class="note target" bind:this={targetEl}>
      <div class="note-contents"></div>
      <div class="ledger-line"></div>
    </div>
    <div class="note played" bind:this={playedEl}>
      <div class="note-contents"></div>
      <div class="ledger-line"></div>
    </div>
    <!-- <span class="ledger-line"></span> -->
  </div>
</section>

<style lang="scss">
  .staff {
    font-family: 'Noto Music', sans-serif;
    position: relative;
    .line {
      border-top: 1.25pt solid #222;
      margin: 0.75rem 0;
      &.invisible {
        border-color: transparent;
      }
    }
    .g-clef {
      font-size: 3.6rem;
      bottom: 4.2rem;
      left: 1rem;
      pointer-events: none;
      position: absolute;
      user-select: none;
    }
    .f-clef {
      bottom: -0.7rem;
      font-size: 3.6rem;
      left: 1rem;
      pointer-events: none;
      position: absolute;
      user-select: none;
    }
    .note {
      font-size: 3.1rem;
      // pointer-events: none;
      position: absolute;
    }
    .target {
      display: none;
      left: 6rem;
    }
    .played {
      display: none;
      left: 9rem;
    }
    .ledger-line {
      position: relative;
      &::after {
        border-top: 1.25pt solid #222;
        bottom: 1.14rem;
        content: ' ';
        display: block;
        position: absolute;
        width: 1.65rem;
      }
    }
    .ledger-line2 {
      border-top: 1.25pt solid #222;
      left: 9rem;
      width: 1.65rem;
      position: absolute;
      top: calc(-0.75rem - 1.25pt);
    }
  }
  :global(.wrong) {
    color: red;
  }
  :global(.correct) {
    @apply text-green-500;
  }
</style>
