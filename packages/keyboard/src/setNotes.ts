import type { ScaleNote } from '@/chords-and-scales'
import { KeyboardKey } from './types'

type Rows = [KeyboardKey[], KeyboardKey[], KeyboardKey[], KeyboardKey[]]

export function setNotesForMiddleRow(rows: Rows, notes: ScaleNote[]) {
  rows[1].forEach((_, idx) => {
    let note: ScaleNote | undefined
    if (idx === 2) {
      note = { ...notes[1] }
    } else if (idx === 3) {
      note = { ...notes[3] }
    } else if (idx === 5) {
      note = { ...notes[6] }
    } else if (idx === 6) {
      note = { ...notes[8] }
    } else if (idx === 7) {
      note = { ...notes[10] }
    } else if (idx === 9) {
      note = { ...notes[1] }
      note.semitones += 12
    } else if (idx === 10) {
      note = { ...notes[3] }
      note.semitones += 12
    } else if (idx === 12) {
      note = { ...notes[6] }
      note.semitones += 12
    }
    rows[1][idx].note = note
  })
  rows[2].forEach((_, idx) => {
    let note: ScaleNote | undefined
    if (idx === 1) {
      note = { ...notes[0] }
    } else if (idx === 2) {
      note = { ...notes[2] }
    } else if (idx === 3) {
      note = { ...notes[4] }
    } else if (idx === 4) {
      note = { ...notes[5] }
    } else if (idx === 5) {
      note = { ...notes[7] }
    } else if (idx === 6) {
      note = { ...notes[9] }
    } else if (idx === 7) {
      note = { ...notes[11] }
    } else if (idx === 8) {
      note = { ...notes[0] }
      note.semitones += 12
    } else if (idx === 9) {
      note = { ...notes[2] }
      note.semitones += 12
    } else if (idx === 10) {
      note = { ...notes[4] }
      note.semitones += 12
    } else if (idx === 11) {
      note = { ...notes[5] }
      note.semitones += 12
    } else if (idx === 12) {
      note = { ...notes[7] }
      note.semitones += 12
    }
    rows[2][idx].note = note
  })
  return rows
}
