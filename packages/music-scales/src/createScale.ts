import { scales } from './scales'

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

const regexKey = /^[a-gA-G][♭b#♯]?$/

/**
 * Creates a scale from 2-length key and scale name
 *
 * @param rawKey Key comprising of [a-gA-G][♭b#♯]?
 * @param scaleName
 * @returns
 */
export function createScale(rawKey: string, scaleName: string): Result<NotePos[]> {
  const scale = scales[scaleName as keyof typeof scales]
  if (!regexKey.test(rawKey)) {
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
  const alphabet = 'ABCDEFG'
  let letter = notes[0].note.charAt(0)
  for (let i = 0; i < scale.length - 1; i += 1) {
    letter = alphabet.charAt((alphabet.indexOf(letter) + (scale[i] <= 2 ? 1 : 2)) % alphabet.length)
    letters.push(letter)
  }
  let note: NotePos
  for (let next = 1; next < scale.length; next += 1) {
    letter = letters[next]
    idx = (idx + scale[next]) % 12
    note = NOTES[idx]
    // console.log('letters', letters)
    // console.log('note', note)
    const n = note.note.charAt(0)
    if (n < letter || (n === 'G' && letter === 'A')) {
      // 'A' < 'B'
      const higher = NOTES[(idx + 1) % 12]
      // shift upwards -> key = Eb, note = G#, letter = A -> lower = G, higher = A -> Ab
      notes.push({ ...note, note: higher.note + '♭', flat: true })
    } else if (n > letter || (n === 'A' && letter === 'G')) {
      // 'G' > 'F'
      const lower = NOTES[idx === 0 ? NOTES.length - 1 : idx - 1]
      // shift downwards -> key = F#, note = Bb -> lower = A, higher = C -> A#
      notes.push({ ...note, note: lower.note + '♯', sharp: true })
    } else {
      // Correct letter
      notes.push(note)
    }
  }
  return { data: notes }
}
