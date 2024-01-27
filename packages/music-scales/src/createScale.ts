import { scales } from './scales'

import type { Result } from '@/types'

export interface NotePos {
  note: string
  order: number
  steps: number
  black: boolean
  sharp: boolean
  flat: boolean
}

const NOTES = [
  { note: 'C', order: 0, steps: 0, black: false, sharp: false, flat: false },
  { note: 'C♯', order: 1, steps: 0, black: true, sharp: true, flat: false },
  { note: 'D', order: 2, steps: 1, black: false, sharp: false, flat: false },
  { note: 'E♭', order: 3, steps: 2, black: true, sharp: false, flat: true },
  { note: 'E', order: 4, steps: 2, black: false, sharp: false, flat: false },
  { note: 'F', order: 5, steps: 3, black: false, sharp: false, flat: false },
  { note: 'F♯', order: 6, steps: 3, black: true, sharp: true, flat: false },
  { note: 'G', order: 7, steps: 4, black: false, sharp: false, flat: false },
  { note: 'G♯', order: 8, steps: 4, black: true, sharp: true, flat: false },
  { note: 'A', order: 9, steps: 5, black: false, sharp: false, flat: false },
  { note: 'B♭', order: 10, steps: 6, black: true, sharp: false, flat: true },
  { note: 'B', order: 11, steps: 6, black: false, sharp: false, flat: false }
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
  let scale = scales[scaleName as keyof typeof scales]
  if (!scale) {
    scale = Object.values(scales).find(
      v => v.name.toLowerCase() === scaleName.toLowerCase()
    ) as (typeof scales)[keyof typeof scales]
  }
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
    idx = NOTES.findIndex(n => n.note.charAt(0) === key.charAt(0) && n.note.length === 1)
    idx = flat ? (idx - 1) % 12 : idx + 1
    notes.push({ ...NOTES[idx], flat, sharp, note: key })
  } else {
    notes.push(NOTES[idx])
  }
  const letters: string[] = [notes[0].note.charAt(0)]
  const alphabet = 'ABCDEFG'
  let letter = notes[0].note.charAt(0)
  let doubleHalfTone = false
  const { tones } = scale
  for (let i = 0; i < tones.length - 1; i += 1) {
    // Here we generate the note names never using the same name twice (as is the convention)
    // The interval of 1-2 in most cases resolves to next letter but when it's over >2,
    // it _usually_ is skipped over and the 2nd next is chosen EXCEPT when the note would be already taken
    // Or something like that...
    const adjacent = alphabet.charAt((alphabet.indexOf(letter) + 1) % alphabet.length)
    const twoSteps = alphabet.charAt((alphabet.indexOf(letter) + 2) % alphabet.length)
    // this is ridiculous
    if (((tones.length <= 5 && tones[i] > 2) || tones[i] > 3) && !letters.includes(twoSteps)) {
      letter = twoSteps
    } else if (
      tones.length > 7 &&
      !doubleHalfTone &&
      i + 1 !== tones.length - 1 &&
      tones[i + 1] === 1 &&
      tones[i] === 1
    ) {
      // Double adjacent half-tones in 8-length scale should resolve to base note even though it's not unique
      // -> bebop major, Algerian etc
      letter = alphabet.charAt(alphabet.indexOf(letter))
      doubleHalfTone = true
    } else {
      letter = adjacent
    }
    letters.push(letter)
  }
  let note: NotePos
  for (let next = 0; next < tones.length - 1; next += 1) {
    letter = letters[next + 1]
    idx = (idx + tones[next]) % 12
    note = NOTES[idx]
    const n = note.note.charAt(0)
    if (n < letter || (n === 'G' && letter === 'A')) {
      // 'A' < 'B'
      let flats = 1
      let higher = NOTES[(idx + flats) % 12]
      while (higher.note.charAt(0) !== letter) {
        flats += 1
        higher = NOTES[(idx + flats) % 12]
      }
      // shift upwards -> key = Eb, note = G#, letter = A -> lower = G, higher = A -> Ab
      notes.push({ ...note, note: higher.note + '♭'.repeat(flats), flat: true })
    } else if (n > letter || (n === 'A' && letter === 'G')) {
      // 'G' > 'F'
      let sharps = 1
      let lowerIndex = idx === 0 ? NOTES.length - 1 : idx - sharps
      let lower = NOTES[lowerIndex]
      while (lower.note.charAt(0) !== letter) {
        sharps += 1
        lowerIndex = lowerIndex === 0 ? NOTES.length - 1 : lowerIndex - 1
        lower = NOTES[lowerIndex]
      }
      // shift downwards -> key = F#, note = Bb -> lower = A, higher = C -> A#
      notes.push({ ...note, note: lower.note + '♯'.repeat(sharps), sharp: true })
    } else {
      // Correct letter
      notes.push(note)
    }
  }
  return { data: notes }
}
