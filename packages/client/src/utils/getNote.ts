import type { MidiNote } from '@/chords-and-scales'
import type { Note } from '@/types'

export const NOTES = {
  0: { note: 'C', sharps: 0, flats: 0 },
  1: { note: 'C♯', sharps: 1, flats: 0 },
  2: { note: 'D', sharps: 0, flats: 0 },
  3: { note: 'E♭', sharps: 0, flats: 1 },
  4: { note: 'E', sharps: 0, flats: 0 },
  5: { note: 'F', sharps: 0, flats: 0 },
  6: { note: 'F♯', sharps: 1, flats: 0 },
  7: { note: 'G', sharps: 0, flats: 0 },
  8: { note: 'G♯', sharps: 1, flats: 0 },
  9: { note: 'A', sharps: 0, flats: 0 },
  10: { note: 'B♭', sharps: 0, flats: 1 },
  11: { note: 'B', sharps: 0, flats: 0 }
} as const

export const BASE_NOTES = {
  C: { semitones: 0 },
  D: { semitones: 2 },
  E: { semitones: 4 },
  F: { semitones: 5 },
  G: { semitones: 7 },
  A: { semitones: 9 },
  B: { semitones: 11 }
}

export function getOctave(midi: number) {
  return midi === 12 ? 1 : Math.floor((midi - 12) / 12)
}

export function getNoteAbsolute(note: Note | MidiNote) {
  return `${note.note}${getOctave(note.midi)}`
}

export function addParts(note: MidiNote): Note {
  return {
    ...note,
    parts: [
      note.note.charAt(0),
      `${'b'.repeat(note.flats)}${'#'.repeat(note.sharps)}`,
      getOctave(note.midi)
    ]
  }
}

export function getNote(value: number): Note {
  const semitonesFromC0 = value - 12
  const octave = Math.floor(semitonesFromC0 / 12)
  // Center the note from C0 which equals 12 in MIDI values, then get the sequence after C
  // @TODO this might not be same in different MIDI devices -> should prob use frequency instead
  // https://en.wikipedia.org/wiki/C_(musical_note)#Middle_C
  const semitones = semitonesFromC0 % 12
  const note = NOTES[semitones as keyof typeof NOTES]
  return {
    ...note,
    semitones,
    midi: value,
    parts: [note.note.charAt(0), `${'b'.repeat(note.flats)}${'#'.repeat(note.sharps)}`, octave]
  }
}
