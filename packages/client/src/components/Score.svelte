<script lang="ts">
  import { getNote } from '$utils/midi'

  import type { Note } from '@/types'

  export let target: Note | undefined = undefined,
    played: (Note & { correct: boolean }) | undefined = undefined

  let playedEl: HTMLElement
  let targetEl: HTMLElement

  $: targetEl && updateNoteEl(targetEl, target)
  $: playedEl && updateNoteEl(playedEl, played, played?.correct)

  function updateNoteEl(el: HTMLElement, note?: Note, correct?: boolean) {
    if (note) {
      el.style.display = 'block'
      el.style.bottom = positionNote(note.value) + 'rem'
      el.textContent = `${note.flat ? '♭' : note.sharp ? '♯' : ''}𝅝`
      if (correct !== undefined && correct) {
        el.classList.remove('wrong')
        el.classList.add('correct')
      } else if (correct !== undefined) {
        el.classList.remove('correct')
        el.classList.add('wrong')
      }
    } else {
      el.style.display = 'none'
    }
  }

  function positionNote(value: number) {
    const stepSize = 0.4227272727272728 // rem
    // bottom: 7.7rem; G5 80
    // bottom: -1.6rem; 22 steps lower
    // 9.3 / 22 = 0.4227272727272728
    const semiTonesFromC4 = value - 60
    const note = getNote(value)
    const octaves = Math.floor(Math.abs(semiTonesFromC4) / 12)
    let steps
    if (semiTonesFromC4 >= 0) {
      // higher than C4
      steps = octaves * 7 + note.steps
    } else {
      // lower than C4
      steps = -1 * (octaves * 7 + note.steps === 0 ? 0 : 7 - note.steps)
    }
    // Adjust the position 3.05rem being the value for C4 in G-treble
    return 3.05 + stepSize * steps
  }
</script>

<section class={`${$$props.class || ''} score py-4`}>
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
    <span class="note target" bind:this={targetEl}></span>
    <span class="note played" bind:this={playedEl}></span>
  </div>
</section>

<style lang="scss">
  .staff {
    font-family: 'Noto Music', sans-serif;
    position: relative;
    .line + .line {
      margin: 0.75rem 0;
    }
    .line {
      border-top: 1.25pt solid #222;
      &.invisible {
        border-color: transparent;
      }
    }
    .g-clef {
      font-size: 3.3rem;
      left: 1rem;
      position: absolute;
      top: -0.7rem;
    }
    .f-clef {
      bottom: -0.1rem;
      font-size: 3rem;
      left: 1rem;
      position: absolute;
    }
    .note {
      font-size: 3.1rem;
      pointer-events: none;
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
  }
</style>
