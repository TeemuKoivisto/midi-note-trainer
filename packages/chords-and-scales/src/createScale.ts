import { findScale } from './scales'
import { NOTES, getRootNote } from './utils'

import type { Result } from '@/types'
import type { Interval, Scale, ScaleNote } from './types'

const regexKey = /^[a-gA-G][♭b#♯]?$/
const alphabet = 'ABCDEFG'

/**
 * Creates scale letters using unique letters for each interval unless the sequence is duplicated
 * @param first
 * @param intervals
 * @returns
 */
function createScaleLetters(first: string, intervals: Interval[]) {
  const letters: string[] = []
  let letter = first
  let prev: Interval | undefined
  for (let i = 0; i < intervals.length; i += 1) {
    const int = intervals[i]
    if (prev?.seq === int.seq || int.seq === 1) {
      // Tonic or same interval as previous -> reuse letter (all 8-note scales eg Bebop)
      letter = alphabet.charAt(alphabet.indexOf(letter) % alphabet.length)
    } else if (prev && prev.seq < int.seq - 1) {
      // Jump of two intervals -> skip letter
      letter = alphabet.charAt((alphabet.indexOf(letter) + 2) % alphabet.length)
    } else {
      // Take the next letter in order
      letter = alphabet.charAt((alphabet.indexOf(letter) + 1) % alphabet.length)
    }
    prev = int
    letters.push(letter)
  }
  return letters
}

function createScaleNotes(
  foundRoot: ScaleNote,
  letters: string[],
  tones: number[],
  intervals: Interval[]
) {
  const scaleNotes: ScaleNote[] = [foundRoot]
  let idx = foundRoot.order
  let note
  let letter
  for (let next = 0; next < intervals.length - 1; next += 1) {
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
  return scaleNotes
}

/**
 * Creates a scale from 2-length key and scale name
 *
 * @param rawKey Key comprising of [a-gA-G][♭b#♯]?
 * @param scaleName
 * @returns
 */
export function createScale(rawKey: string, scaleName: string): Result<Scale> {
  if (!regexKey.test(rawKey)) {
    return { err: `Unknown key: ${rawKey}`, code: 400 }
  }
  const scale = findScale(scaleName)
  if (!scale) {
    return { err: `Unknown scale: ${scaleName}`, code: 404 }
  }
  const key = `${rawKey.charAt(0).toUpperCase()}${rawKey
    .charAt(1)
    .replace('b', '♭')
    .replace('#', '♯')}`
  const foundRoot = getRootNote(key)
  if (!foundRoot) {
    return { err: `Unable to find root for note: ${key}`, code: 404 }
  }
  const letters = createScaleLetters(key.charAt(0), scale.intervals)
  const scaleNotes = createScaleNotes(foundRoot, letters, scale.tones, scale.intervals)
  const notesMap = new Map<number, ScaleNote>(
    NOTES.map(note => {
      const inScale = scaleNotes.find(n => n.order === note.order)
      if (inScale) {
        return [note.order, inScale]
      } else {
        return [note.order, { ...note }]
      }
    })
  )
  return {
    data: {
      key,
      scale: scale.name,
      keySignature: 'C',
      intervals: scale.intervals,
      scaleNotes,
      notesMap
    }
  }
}
