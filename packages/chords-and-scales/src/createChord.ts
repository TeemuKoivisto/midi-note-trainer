import { intervalToSemitones } from './intervals'

import type { Interval, MidiNote, Scale, ScaleNote } from './types'

function createNote(note: ScaleNote, shiftUpOrDown: number, midi: number) {
  // Shift note down x flats, note double negation -> regular sum
  let flats = shiftUpOrDown < 0 ? note.flats - shiftUpOrDown : note.flats
  // Shift note up x sharps
  let sharps = shiftUpOrDown > 0 ? note.sharps + shiftUpOrDown : note.sharps
  if (flats > 0 && sharps > 0) {
    const diff = Math.min(flats, sharps)
    flats -= diff
    sharps -= diff
  }
  const order = (note.order + shiftUpOrDown) % 12
  return {
    ...note,
    order: order < 0 ? order + 12 : order,
    note: `${note.note.charAt(0)}${'♭'.repeat(flats)}${'♯'.repeat(sharps)}`,
    flats,
    sharps,
    midi
  }
}

/**
 * Creates a chord using starting note, scale and chord intervals
 * @param note
 * @param scale
 * @param chordIntervals
 * @returns
 */
export function createChord(note: number, scale: Scale, chordIntervals: Interval[]) {
  const chordNotes: MidiNote[] = []
  for (let i = 0; i < chordIntervals.length; i += 1) {
    const chordInt = chordIntervals[i]
    const midi = note + intervalToSemitones(chordInt)
    const scaleNote = scale.scaleNotes.find(n => n.order === midi % 12)
    // If interval is flat/sharp, shift the original note UNLESS the resulting note already is in the scale
    // While it may be semantically more correct to leave the flat/sharp as it's, it's magnitudes easier to
    // read the standard notes of the scale instead of weird double flats/sharps
    const shiftUp = chordInt.flats > 0
    const shiftDown = chordInt.sharps > 0
    const order = (shiftUp ? midi + 1 : shiftDown ? midi - 1 : midi) % 12
    const shift = shiftUp ? -1 : shiftDown ? 1 : 0
    chordNotes.push(
      createNote(scaleNote ?? (scale.notesMap.get(order) as ScaleNote), scaleNote ? 0 : shift, midi)
    )
  }
  return chordNotes
}
