import type { ScaleNote } from './types'

export const FLAT_NOTES = ['B♭', 'E♭', 'A♭', 'D♭', 'G♭', 'C♭', 'F♭']
export const SHARP_NOTES = ['F♯', 'C♯', 'G♯', 'D♯', 'A♯', 'E♯', 'B♯']
export const MAJOR_KEY_MAP = new Map([
  [0, 'C'],
  [-1, 'F'],
  [-2, 'B♭'],
  [-3, 'E♭'],
  [-4, 'A♭'],
  [-5, 'D♭'],
  [-6, 'G♭'],
  [-7, 'C♭'],
  [1, 'G'],
  [2, 'D'],
  [3, 'A'],
  [4, 'E'],
  [5, 'B'],
  [6, 'F♯'],
  [7, 'C♯']
])

export function getKeySignature(notes: ScaleNote[]) {
  let flats = 0
  let sharps = 0
  for (let i = 0; i < FLAT_NOTES.length; i += 1) {
    const foundFlat = notes.find(n => n.note.slice(0, 2) === FLAT_NOTES[i])
    const foundSharp = notes.find(n => n.note.slice(0, 2) === SHARP_NOTES[i])
    if (foundFlat) {
      flats += 1
    } else if (foundSharp) {
      sharps += 1
    } else {
      break
    }
  }
  if (flats > sharps) {
    return {
      flats,
      sharps: 0,
      majorSignature: MAJOR_KEY_MAP.get(flats * -1) as string
    }
  } else {
    return {
      flats: 0,
      sharps,
      majorSignature: MAJOR_KEY_MAP.get(sharps) as string
    }
  }
}
