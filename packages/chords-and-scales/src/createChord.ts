import { intervalToSemitones } from './utils'

import type { Chord, Interval, MidiChord, MidiNote, Scale, ScaleNote } from './types'

function createNote(note: ScaleNote, shiftUpOrDown: number, midi: number) {
  // Shift note down x flats, note double negation -> regular sum
  const flats = shiftUpOrDown < 0 ? note.flats - shiftUpOrDown : 0
  // Shift note up x sharps
  const sharps = shiftUpOrDown > 0 ? note.sharps + shiftUpOrDown : 0
  return {
    ...note,
    order: (note.order + shiftUpOrDown) % 12,
    flats,
    sharps,
    note: `${note.note.charAt(0)}${'♭'.repeat(flats)}${'♯'.repeat(sharps)}`,
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
    if (chordInt.flats > 0) {
      chordNotes.push(createNote(scale.notesMap.get((midi + 1) % 12) as ScaleNote, -1, midi))
    } else if (chordInt.sharps > 0) {
      chordNotes.push(createNote(scale.notesMap.get((midi - 1) % 12) as ScaleNote, 1, midi))
    } else {
      chordNotes.push(
        createNote(scaleNote ?? (scale.notesMap.get(midi % 12) as ScaleNote), 0, midi)
      )
    }
  }
  return chordNotes
}
