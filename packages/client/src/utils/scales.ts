import type { Result } from '@/types'

interface NotePos {
  note: string
  black: boolean
  steps: number
  sharp: boolean
  flat: boolean
}

const NOTES = [
  { note: 'C', steps: 0, black: false, sharp: false, flat: false },
  { note: 'C♯', steps: 0, black: true, sharp: true, flat: false },
  { note: 'D', steps: 1, black: false, sharp: false, flat: false },
  { note: 'E♭', steps: 2, black: true, sharp: false, flat: true },
  { note: 'E', steps: 2, black: false, sharp: false, flat: false },
  { note: 'F', steps: 3, black: false, sharp: false, flat: false },
  { note: 'F♯', steps: 3, black: true, sharp: true, flat: false },
  { note: 'G', steps: 4, black: false, sharp: false, flat: false },
  { note: 'G♯', steps: 4, black: true, sharp: true, flat: false },
  { note: 'A', steps: 5, black: false, sharp: false, flat: false },
  { note: 'B♭', steps: 6, black: true, sharp: false, flat: true },
  { note: 'B', steps: 6, black: false, sharp: false, flat: false }
]

// white_keys = [CDEFGBA]
//
// intervals = [2, 1, 2, 1, 2, 2, 1, 2]
//

export const scales = {
  // major
  major: [0, 2, 2, 1, 2, 2, 2]
} as const

const regexScale = /^[a-gA-G][♭b#♯]?$/

/**
 * Creates a scale from 2-length key and scale name
 *
 * @param rawKey Key comprising of [a-gA-G][♭b#♯]?
 * @param scaleName
 * @returns
 */
export function createScale(rawKey: string, scaleName: string): Result<NotePos[]> {
  const scale = scales[scaleName as keyof typeof scales]
  if (!regexScale.test(rawKey)) {
    return { err: `Unknown key: ${rawKey}`, code: 400 }
  } else if (!scale) {
    return { err: `Unknown scale: ${scaleName}`, code: 400 }
  }
  let key = rawKey.toUpperCase()
  if (key.length > 1) {
    key = key[0] + key[1].replace('B', '♭').replace('#', '♯')
  }
  let idx = NOTES.findIndex(n => n.note === key)
  const flat = key.charAt(1) === '♭'
  const sharp = key.charAt(1) === '♯'
  const notes = []
  if (idx === -1) {
    idx = NOTES.findIndex(n => n.note.charAt(0) === key.charAt(0))
    idx = flat ? (idx - 1) % 12 : idx + 1
    notes.push({ ...NOTES[idx], flat, sharp, note: key })
  } else {
    notes.push(NOTES[idx])
  }
  const letters: string[] = [notes[0].note.charAt(0)]
  // console.log(`${flat && 'flat'} ${sharp && 'sharp'}`)
  for (let next = 1; next < scale.length; next += 1) {
    idx = (idx + scale[next]) % 12
    const note = NOTES[idx]
    // console.log('letters', letters)
    // console.log('note', note)
    if (note.sharp && flat) {
      const higher = NOTES[(idx + 1) % 12]
      // key = Eb, note = G# -> lower = G, higher = A -> Ab
      notes.push({ ...note, note: higher.note.charAt(0) + '♭', flat: true })
    } else if (note.flat && sharp) {
      const lower = NOTES[(idx - 1) % 12]
      // key = F#, note = Bb -> lower = A, higher = C -> A#
      notes.push({ ...note, note: lower.note.charAt(0) + '♯', sharp: true })
    } else if (letters.includes(note.note.charAt(0))) {
      // key = F#, note = F -> lower = E, higher = F# -> E#
      const lower = NOTES[(idx - 1) % 12]
      notes.push({ ...note, note: lower.note.charAt(0) + '♯', sharp: true })
    } else {
      notes.push(note)
    }
    letters.push(notes[notes.length - 1].note.charAt(0))
  }
  return { data: notes }
}
