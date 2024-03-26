import type { ScaleNote } from '@/chords-and-scales'
import type { KeyboardKey, Rows } from './types'

const WHITE_INDECES = [0, 2, 4, 5, 7, 9, 11]
const BLACK_INDECES = [1, 3, -1, 6, 8, 10, -1]

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
  startKeyOffset = 0,
  startIndex = 0
) {
  const indeces = whiteKeys ? WHITE_INDECES : BLACK_INDECES
  let firstIndex = -1
  let emptyKeys = 0
  let lastNote: ScaleNote | undefined
  let lastIndex = 0
  keys.forEach((k, idx) => {
    if (k.key.charAt(0) !== '{' && idx >= startKeyOffset && firstIndex === -1) {
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
        lastNote = k.note
        lastIndex = idx - firstIndex
      }
    }
  })
  return { firstIndex, lastIndex }
}
