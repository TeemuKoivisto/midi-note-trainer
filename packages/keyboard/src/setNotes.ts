import type { ScaleNote } from '@/chords-and-scales'
import type { Row } from './types'

export const WHITE_INDECES = [0, 2, 4, 5, 7, 9, 11]
export const BLACK_INDECES = [1, 3, -1, 6, 8, 10, -1]

export function getNote(row: Row, notes: ScaleNote[], index: number): ScaleNote | undefined {
  const indeces = row.keyType === 'white' ? WHITE_INDECES : BLACK_INDECES
  const noteIndex = indeces[index % indeces.length]
  let note: ScaleNote | undefined
  if (noteIndex >= 0) {
    note = notes[noteIndex]
    const octaves = Math.floor(index / indeces.length)
    return {
      ...note,
      semitones: note.semitones + (octaves > 0 ? octaves : 0) * 12
    }
  }
  return undefined
}

export function setNotes(row: Row, notes: ScaleNote[], startKeyOffset = 0, startIndex = 0) {
  const indeces = row.keyType === 'white' ? WHITE_INDECES : BLACK_INDECES
  let firstIndex = -1
  let emptyKeys = 0
  let lastIndex = 0
  row.keys.forEach((k, idx) => {
    if (k.key.charAt(0) !== '{' && idx >= startKeyOffset && firstIndex === -1) {
      // Start setting notes to first non-special key
      firstIndex = idx
    } else if (firstIndex !== -1 && k.key === '{empty}') {
      // Don't set notes to empty keys
      emptyKeys += 1
    }
    if (firstIndex !== -1 && k.key.charAt(0) !== '{') {
      const index = idx - emptyKeys - firstIndex + startIndex
      const noteIndex = indeces[index % indeces.length]
      if (noteIndex >= 0) {
        const note = notes[noteIndex]
        const octaves = Math.floor(index / indeces.length)
        k.note = {
          ...note,
          semitones: note.semitones + (octaves > 0 ? octaves : 0) * 12
        }
        lastIndex = idx - firstIndex
      }
    }
  })
  return { firstIndex, lastIndex }
}
