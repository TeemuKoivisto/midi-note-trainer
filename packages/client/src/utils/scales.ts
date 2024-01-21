import type { Result } from '@/types'

// intervals = [2, 1, 2, 1, 2, 2, 1, 2]
//

interface NotePos {
  note: string
  black: boolean
  steps: number
  sharp: boolean
  flat: boolean
}

export const C_MAJOR_NOTES = {
  0: { note: 'C', steps: 0, black: false, sharp: false, flat: false },
  1: { note: 'C♯', steps: 0, black: true, sharp: true, flat: false },
  2: { note: 'D', steps: 1, black: false, sharp: false, flat: false },
  3: { note: 'E♭', steps: 2, black: true, sharp: false, flat: true },
  4: { note: 'E', steps: 2, black: false, sharp: false, flat: false },
  5: { note: 'F', steps: 3, black: false, sharp: false, flat: false },
  6: { note: 'F♯', steps: 3, black: true, sharp: true, flat: false },
  7: { note: 'G', steps: 4, black: false, sharp: false, flat: false },
  8: { note: 'G♯', steps: 4, black: true, sharp: true, flat: false },
  9: { note: 'A', steps: 5, black: false, sharp: false, flat: false },
  10: { note: 'B♭', steps: 6, black: true, sharp: false, flat: true },
  11: { note: 'B', steps: 6, black: false, sharp: false, flat: false }
}

export const scales = {
  // major
  major: [0, 2, 2, 1, 2, 2, 2]
} as const

export type Scale =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'Bb'
  | 'Eb'
  | 'Ab'
  | 'Db'
  | 'Gb'
  | 'F#'
  | 'C#'

const regexScale = /^[a-gA-G][♭b#♯]?$/

/**
 * Key
 * @param rawKey Key comprising of [a-gA-G][♭b#♯]?
 * @param scaleName
 * @returns
 */
export function createScale(rawKey: string, scaleName: string): Result<any[]> {
  const scale = scales[scaleName as keyof typeof scales]
  if (!regexScale.test(rawKey)) {
    return { err: `Unknown key: ${rawKey}`, code: 400 }
  } else if (!scale) {
    return { err: `Unknown scale: ${scale}`, code: 400 }
  }
  let key = rawKey.toUpperCase()
  if (key.length > 1) {
    key = key[0] + key[1].replace('B', '♭').replace('#', '♯')
  }
  const start = Object.entries(C_MAJOR_NOTES).find(([k, v]) => v.note === key)
  if (!start) {
    return { err: `Couldn't find the starting note for: ${key}`, code: 500 }
  }
  const notes = []
  const flat = key.charAt(1) === '♭'
  const sharp = key.charAt(1) === '♯'
  const letters = [start[1].note.charAt(0)]
  let idx = parseInt(start[0])
  console.log(`${flat && 'flat'} ${sharp && 'sharp'}`)
  for (let next = 0; next < scale.length; next += 1) {
    idx = (idx + scale[next]) % 12
    const note = C_MAJOR_NOTES[idx as keyof typeof C_MAJOR_NOTES]
    if (note.sharp && flat) {
      const higher = C_MAJOR_NOTES[((idx + 1) % 12) as keyof typeof C_MAJOR_NOTES]
      // key = Eb, note = G# -> lower = G, higher = A -> Ab
      notes.push({ ...note, note: higher.note.charAt(0) + '♭', flat: true })
    } else if (note.flat && sharp) {
      const lower = C_MAJOR_NOTES[((idx - 1) % 12) as keyof typeof C_MAJOR_NOTES]
      // key = F#, note = Bb -> lower = A, higher = C -> A#
      notes.push({ ...note, note: lower.note.charAt(0) + '♯', sharp: true })
    } else {
      notes.push(note)
    }
  }
  return { data: notes }
}
