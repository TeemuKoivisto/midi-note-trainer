import type { MidiNote, Result, ScaleNote } from './types'

const flatAccidental = /^[♭Bb]$/
const sharpAccidental = /^[#♯sS]$/
const regexKeyLetter = /^[a-gA-G]$/
const regexPosInt = /^[0-9]$/
const regexKey = /^[a-gA-G][♭Bb#♯sS]*$/
const regexKeyOctave = /^[a-gA-G][♭Bb#♯sS]*[0-9]?$/

export const NOTES = [
  { note: 'C', semitones: 0, sharps: 0, flats: 0 },
  { note: 'C♯', semitones: 1, sharps: 1, flats: 0 },
  { note: 'D', semitones: 2, sharps: 0, flats: 0 },
  { note: 'E♭', semitones: 3, sharps: 0, flats: 1 },
  { note: 'E', semitones: 4, sharps: 0, flats: 0 },
  { note: 'F', semitones: 5, sharps: 0, flats: 0 },
  { note: 'F♯', semitones: 6, sharps: 1, flats: 0 },
  { note: 'G', semitones: 7, sharps: 0, flats: 0 },
  { note: 'G♯', semitones: 8, sharps: 1, flats: 0 },
  { note: 'A', semitones: 9, sharps: 0, flats: 0 },
  { note: 'B♭', semitones: 10, sharps: 0, flats: 1 },
  { note: 'B', semitones: 11, sharps: 0, flats: 0 }
]

export const isValidKey = (raw: string) => regexKey.test(raw)
export const normalizeKey = (raw: string) =>
  regexKeyLetter.test(raw[0] || '')
    ? [
        raw[0].toUpperCase(),
        ...raw
          .slice(1)
          .split('')
          .map(c => (flatAccidental.test(c) ? '♭' : sharpAccidental.test(c) ? '♯' : ''))
      ].join('')
    : ''

export function getOctave(note: { midi: number; flats: number; sharps: number }) {
  const norm = note.midi + note.flats - note.sharps
  return norm === 12 ? 0 : Math.floor((norm - 12) / 12)
}

export function getNoteAbsolute(note: {
  note: string
  midi: number
  flats: number
  sharps: number
}) {
  return `${note.note}${getOctave(note)}`
}

export function getNote(midi: number): MidiNote {
  const semitonesFromC0 = midi - 12
  // Center the note from C0 which equals 12 in MIDI values, then get the sequence after C
  // @TODO this might not be same in different MIDI devices -> should prob use frequency instead
  // https://en.wikipedia.org/wiki/C_(musical_note)#Middle_C
  const semitones = semitonesFromC0 % 12
  const note = NOTES[semitones]
  return {
    ...note,
    semitones,
    midi
  }
}

export function parseNote(raw: string, strict = true, requireOctave = false): Result<MidiNote> {
  if (strict && !regexKeyOctave.test(raw)) {
    return { err: `Unrecognized note "${raw}"`, code: 400 }
  }
  const note = raw.trim()
  const letter = note.charAt(0).toUpperCase()
  const rootNote = NOTES.find(n => n.note.charAt(0) === letter && n.note.length === 1)
  if (!rootNote) {
    return { err: `Unable to find note ${note}`, code: 500 }
  }
  const shifted = note
    .slice(1)
    .split('')
    .reduce((acc, c) => acc + (flatAccidental.test(c) ? -1 : sharpAccidental.test(c) ? 1 : 0), 0)
  let octave: number | undefined
  if (regexPosInt.test(note.charAt(note.length - 1))) {
    try {
      octave = parseInt(note.charAt(note.length - 1), 10)
    } catch (err: any) {}
  }
  if (requireOctave && octave === undefined) {
    return { err: `No octave provided: ${raw}`, code: 400 }
  } else if (octave === undefined) {
    octave = 0
  }
  let semitones = (rootNote.semitones + shifted) % 12
  semitones = semitones < 0 ? semitones + 12 : semitones
  const flats = shifted < 0 ? -shifted : 0
  const sharps = shifted > 0 ? shifted : 0
  return {
    data: {
      note: `${letter}${'♭'.repeat(flats)}${'♯'.repeat(sharps)}`,
      semitones,
      midi: 12 + octave * 12 + semitones,
      flats,
      sharps
    }
  }
}

export function getRootNote(note: string): ScaleNote | undefined {
  const rootNote = NOTES.find(n => n.note.charAt(0) === note.charAt(0) && n.note.length === 1)
  if (rootNote) {
    const shifted = note
      .slice(1)
      .split('')
      .reduce((acc, c) => acc + (flatAccidental.test(c) ? -1 : sharpAccidental.test(c) ? 1 : 0), 0)
    const semitones = (rootNote.semitones + shifted) % 12
    return {
      note,
      semitones: semitones < 0 ? semitones + 12 : semitones,
      flats: shifted < 0 ? -shifted : 0,
      sharps: shifted > 0 ? shifted : 0
    }
  }
  return undefined
}

export function noteIntoString(val: { note: string; flats: number; sharps: number }) {
  return `${val.note.trim().charAt(0).toUpperCase()}${'♭'.repeat(val.flats)}${'♯'.repeat(
    val.sharps
  )}`
}
