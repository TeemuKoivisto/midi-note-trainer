import type { MidiNote } from '@/chords-and-scales'
import type { Note, Result } from '@/types'

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
  C: { order: 0 },
  D: { order: 2 },
  E: { order: 4 },
  F: { order: 5 },
  G: { order: 7 },
  A: { order: 9 },
  B: { order: 11 }
}

export function getOctave(midi: number) {
  return midi === 12 ? 1 : Math.floor((midi - 12) / 12)
}

export function getNoteAbsolute(note: Note) {
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
  const order = semitonesFromC0 % 12
  const note = NOTES[order as keyof typeof NOTES]
  return {
    ...note,
    order,
    midi: value,
    parts: [note.note.charAt(0), `${'b'.repeat(note.flats)}${'#'.repeat(note.sharps)}`, octave]
  }
}

export function parseNote(val: string): Result<number> {
  if (val.length === 2 || val.length === 3) {
    const baseNote = BASE_NOTES[val.charAt(0).toUpperCase() as keyof typeof BASE_NOTES]
    if (!baseNote) {
      return { err: `Base note ${val.charAt(0).toUpperCase()} not in notes ABCDEFG`, code: 400 }
    }
    const shifted = val
      .slice(1, -1)
      .split('')
      .reduce(
        (acc, c) =>
          acc + c.toLowerCase() === 'b' || c === '♭' ? -1 : c === '#' || c === '♯' ? 1 : 0,
        0
      )
    let octave: number | undefined
    try {
      octave = parseInt(val[val.length - 1])
    } catch (err) {
      return { err: `Couldn't parse note "${val}" octave`, code: 400 }
    }
    return { data: 12 + octave * 12 + baseNote.order + shifted }
  } else {
    return { err: `Unrecognized note "${val}"`, code: 400 }
  }
}
