import type { ScaleNote } from './types'

export const NOTES = [
  { note: 'C', order: 0, sharps: 0, flats: 0 },
  { note: 'C♯', order: 1, sharps: 1, flats: 0 },
  { note: 'D', order: 2, sharps: 0, flats: 0 },
  { note: 'E♭', order: 3, sharps: 0, flats: 1 },
  { note: 'E', order: 4, sharps: 0, flats: 0 },
  { note: 'F', order: 5, sharps: 0, flats: 0 },
  { note: 'F♯', order: 6, sharps: 1, flats: 0 },
  { note: 'G', order: 7, sharps: 0, flats: 0 },
  { note: 'G♯', order: 8, sharps: 1, flats: 0 },
  { note: 'A', order: 9, sharps: 0, flats: 0 },
  { note: 'B♭', order: 10, sharps: 0, flats: 1 },
  { note: 'B', order: 11, sharps: 0, flats: 0 }
]

export function getRootNote(note: string): ScaleNote | undefined {
  const rootNote = NOTES.find(n => n.note.charAt(0) === note.charAt(0) && n.note.length === 1)
  if (rootNote) {
    const shifted = note
      .slice(1)
      .split('')
      .reduce(
        (acc, c) =>
          acc + (c.toLowerCase() === 'b' || c === '♭' ? -1 : c === '#' || c === '♯' ? 1 : 0),
        0
      )
    const order = (rootNote.order + shifted) % 12
    return {
      note,
      order: order < 0 ? order + 12 : order,
      flats: shifted < 0 ? shifted * -1 : 0,
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
