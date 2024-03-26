import type { ScaleNote } from '@/chords-and-scales'
import type { KeyboardKey, Rows } from './types'

export function getNote(
  index: number,
  notes: ScaleNote[],
  whiteKeys: boolean
): ScaleNote | undefined {
  const indeces = whiteKeys ? [0, 2, 4, 5, 7, 9, 11] : [-1, 1, 3, -1, 6, 8, 10]
  const noteIndex = indeces[index % indeces.length]
  if (noteIndex >= 0) {
    const note = notes[noteIndex]
    const octaves = Math.floor(index / indeces.length)
    return {
      ...note,
      semitones: note.semitones + (octaves > 0 ? octaves : 0) * 12
    }
  }
  return undefined
}

export function setNotes(
  keys: KeyboardKey[],
  notes: ScaleNote[],
  whiteKeys: boolean,
  startIndex = 0
) {
  const indeces = whiteKeys ? [0, 2, 4, 5, 7, 9, 11] : [-1, 1, 3, -1, 6, 8, 10]
  let firstIndex = -1
  let emptyKeys = 0
  let lastNote: ScaleNote | undefined
  let lastIndex = 0
  keys.forEach((k, idx) => {
    const isSpecial = k.key.charAt(0) === '{' && k.key !== '{empty}'
    if (!isSpecial && firstIndex === -1) {
      firstIndex = idx
    }
    if (k.key === '{empty}') {
      // Don't set notes to empty keys
      emptyKeys += 1
    } else {
      const index = idx - emptyKeys - firstIndex + startIndex
      const noteIndex = indeces[index % indeces.length]
      if (firstIndex !== -1 && idx !== 0 && !isSpecial && noteIndex >= 0) {
        const note = notes[noteIndex]
        const octaves = Math.floor(index / indeces.length)
        k.note = {
          ...note,
          semitones: note.semitones + (octaves > 0 ? octaves : 0) * 12
        }
        lastNote = k.note
        lastIndex = idx - firstIndex
      }
    }
  })
  return lastIndex
}
