import type { Note, Result } from '@/types'

export const C_MAJOR_NOTES = {
  0: { note: 'C', steps: 0, sharp: false, flat: false },
  1: { note: 'C♯', steps: 0, sharp: true, flat: false },
  2: { note: 'D', steps: 1, sharp: false, flat: false },
  3: { note: 'E♭', steps: 2, sharp: false, flat: true },
  4: { note: 'E', steps: 2, sharp: false, flat: false },
  5: { note: 'F', steps: 3, sharp: false, flat: false },
  6: { note: 'F♯', steps: 3, sharp: true, flat: false },
  7: { note: 'G', steps: 4, sharp: false, flat: false },
  8: { note: 'G♯', steps: 4, sharp: true, flat: false },
  9: { note: 'A', steps: 5, sharp: false, flat: false },
  10: { note: 'B♭', steps: 6, sharp: false, flat: true },
  11: { note: 'B', steps: 6, sharp: false, flat: false }
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

export function getNote(value: number): Note {
  const semitonesFromC0 = value - 12
  const octave = Math.floor(semitonesFromC0 / 12)
  // Center the note from C0 which equals 12 in MIDI values, then get the sequence after C
  // @TODO this might not be same in different MIDI devices -> should prob use frequency instead
  // https://en.wikipedia.org/wiki/C_(musical_note)#Middle_C
  const note = C_MAJOR_NOTES[(semitonesFromC0 % 12) as keyof typeof C_MAJOR_NOTES]
  return {
    ...note,
    octave,
    value,
    absolute: `${note.note}${octave}`,
    parts: [note.note.charAt(0), note.flat ? 'b' : note.sharp ? '#' : '', octave]
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
