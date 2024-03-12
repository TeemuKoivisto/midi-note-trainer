import type { ScaleNote } from '@/chords-and-scales'
import type { KeyboardKey, Rows } from './types'

export function setNotes(
  keys: KeyboardKey[],
  notes: ScaleNote[],
  whiteKeys: boolean,
  startIndex = 0
) {
  const indeces = whiteKeys ? [0, 2, 4, 5, 7, 9, 11] : [-1, 1, 3, -1, 6, 8, 10]
  let firstIndex = -1
  let lastNote: ScaleNote | undefined
  let lastIndex = 0
  keys.forEach((k, idx) => {
    const specialKey = k.key.charAt(0) === '{'
    if (!specialKey && firstIndex === -1) {
      firstIndex = idx
    }
    const noteIndex = indeces[(idx - firstIndex + startIndex) % indeces.length]
    if (firstIndex !== -1 && idx !== 0 && !specialKey && noteIndex >= 0) {
      const note = notes[noteIndex]
      const octaves = Math.floor((startIndex + idx - firstIndex) / indeces.length)
      k.note = {
        ...note,
        semitones: note.semitones + (octaves > 0 ? octaves : 0) * 12
      }
      lastNote = k.note
      lastIndex = idx - firstIndex
    }
  })
  // console.log(notes[indeces[lastIndex % indeces.length]])
  return lastIndex
}
