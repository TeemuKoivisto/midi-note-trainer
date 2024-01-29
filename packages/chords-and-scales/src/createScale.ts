import { scales } from './scales'

import type { Result } from '@/types'

export interface Interval {
  seq: number
  flats: number
  sharps: number
}
export interface ScaleNote {
  note: string
  order: number
  flats: number
  sharps: number
}
export interface Scale {
  key: string // eg C
  scale: string // eg major
  keySignature: string // using standard diatonic accidentals
  intervals: Interval[]
  scaleNotes: ScaleNote[]
  notesMap: Map<number, ScaleNote> // all 12 semitones of octave
}

const regexPosInt = /^[0-9]$/

function parseInteger(str: string) {
  try {
    return parseInt(str)
  } catch (err: any) {
    return 0
  }
}

export function createIntervals(intervals: readonly string[]): Interval[] {
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
    return { seq: parseInteger(intervalStr), flats, sharps }
  })
}

const NOTES = [
  { note: 'C', order: 0, black: false, sharp: false, flat: false },
  { note: 'C♯', order: 1, black: true, sharp: true, flat: false },
  { note: 'D', order: 2, black: false, sharp: false, flat: false },
  { note: 'E♭', order: 3, black: true, sharp: false, flat: true },
  { note: 'E', order: 4, black: false, sharp: false, flat: false },
  { note: 'F', order: 5, black: false, sharp: false, flat: false },
  { note: 'F♯', order: 6, black: true, sharp: true, flat: false },
  { note: 'G', order: 7, black: false, sharp: false, flat: false },
  { note: 'G♯', order: 8, black: true, sharp: true, flat: false },
  { note: 'A', order: 9, black: false, sharp: false, flat: false },
  { note: 'B♭', order: 10, black: true, sharp: false, flat: true },
  { note: 'B', order: 11, black: false, sharp: false, flat: false }
]

const regexKey = /^[a-gA-G][♭b#♯]?$/

/**
 * Creates a scale from 2-length key and scale name
 *
 * @param rawKey Key comprising of [a-gA-G][♭b#♯]?
 * @param scaleName
 * @returns
 */
export function createScale(rawKey: string, scaleName: string): Result<Scale> {
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
  const scaleNotes: ScaleNote[] = []
  const notesMap = new Map<number, ScaleNote>()
  if (idx === -1) {
    idx = NOTES.findIndex(n => n.note.charAt(0) === key.charAt(0) && n.note.length === 1)
    idx = flat ? (idx === 0 ? NOTES.length - 1 : idx - 1) : (idx + 1) % 12
    scaleNotes.push({
      order: NOTES[idx].order,
      note: key,
      flats: flat ? 1 : 0,
      sharps: sharp ? 1 : 0
    })
  } else {
    scaleNotes.push({
      order: NOTES[idx].order,
      note: NOTES[idx].note,
      flats: flat ? 1 : 0,
      sharps: sharp ? 1 : 0
    })
  }
  const letters: string[] = [scaleNotes[0].note.charAt(0)]
  const alphabet = 'ABCDEFG'
  let letter = scaleNotes[0].note.charAt(0)
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
  const intervals = createIntervals(scale.notes)
  let note: { note: string; order: number; black: boolean; sharp: boolean; flat: boolean }
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
      scaleNotes.push({
        order: note.order,
        note: higher.note + '♭'.repeat(flats),
        flats,
        sharps: 0
      })
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
      scaleNotes.push({
        order: note.order,
        note: lower.note + '♯'.repeat(sharps),
        flats: 0,
        sharps
      })
    } else {
      // Correct letter
      scaleNotes.push({ order: note.order, note: note.note, flats: 0, sharps: 0 })
    }
  }
  scaleNotes.forEach(n => {
    notesMap.set(n.order, n)
  })
  return {
    data: {
      key,
      scale: scale.name,
      keySignature: 'C',
      intervals,
      scaleNotes,
      notesMap
    }
  }
}
