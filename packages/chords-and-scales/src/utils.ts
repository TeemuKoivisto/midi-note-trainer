import type { Interval, ScaleNote } from './types'

const regexPosInt = /^[0-9]$/

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
    const acc = note.charAt(1).toLowerCase()
    const flats = acc === 'b' || acc === '♭' ? 1 : 0
    const sharps = acc === '#' || acc === '♯' ? 1 : 0
    const order = flats > 0 ? rootNote.order - 1 : sharps > 0 ? rootNote.order + 1 : rootNote.order
    return {
      note: note.charAt(0) + acc,
      order: order < 0 ? 11 : order > 11 ? 0 : order,
      flats,
      sharps
    }
  }
  return undefined
}

export function parseInteger(str: string) {
  try {
    return parseInt(str)
  } catch (err: any) {
    return 0
  }
}

export function parseIntervals(intervals: readonly string[]): Interval[] {
  return intervals.map(str => {
    let intervalStr = ''
    let flats = 0
    let sharps = 0
    for (let j = 0; j < str.length; j += 1) {
      if (str[j] === 'b' || str[j] === '♭') {
        flats += 1
      } else if (str[j] === '#' || str[j] === '♯' || str[j] === 's') {
        sharps += 1
      } else if (regexPosInt.test(str[j])) {
        intervalStr += str[j]
      }
    }
    return { str, seq: parseInteger(intervalStr), flats, sharps }
  })
}

export function noteIntoString(val: { note: string; flats: number; sharps: number }) {
  return `${val.note.trim().charAt(0).toUpperCase()}${'♭'.repeat(val.flats)}${'♯'.repeat(
    val.sharps
  )}`
}

const SEMI_TONES: Record<number, number> = {
  1: 0,
  2: 2,
  3: 4,
  4: 5,
  5: 7,
  6: 9,
  7: 11
}

export function intervalToSemitones(interval: Interval) {
  return (
    (interval.seq < 8 ? SEMI_TONES[interval.seq] : SEMI_TONES[interval.seq % 7]) -
    interval.flats +
    interval.sharps +
    Math.floor(interval.seq / 8) * 12
  )
}
