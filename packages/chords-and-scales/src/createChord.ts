import { intervalToSemitones } from './utils'

import type { Chord, Interval, MidiChord, MidiNote, Scale, ScaleNote } from './types'

function createNote(note: ScaleNote, shift: number, midi: number) {
  const flats = note.flats > 0 ? note.flats - shift : 0
  const sharps = note.sharps > 0 ? note.sharps + shift : 0
  return {
    ...note,
    order: (note.order + shift) % 12,
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
    if (scaleNote) {
      chordNotes.push(createNote(scaleNote, 0, midi))
    } else if (chordInt.flats > 0) {
      chordNotes.push(createNote(scale.notesMap.get((midi + 1) % 12) as ScaleNote, 1, midi))
    } else if (chordInt.sharps > 0) {
      chordNotes.push(createNote(scale.notesMap.get((midi - 1) % 12) as ScaleNote, -1, midi))
    } else {
      chordNotes.push(createNote(scale.notesMap.get(midi % 12) as ScaleNote, 0, midi))
    }
  }
  return chordNotes
}
