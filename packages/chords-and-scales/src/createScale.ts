import { getKeySignature } from './getKeySignature'
import { findScale } from './scales'
import { intervalToSemitones } from './intervals'
import { NOTES, getRootNote } from './notes'

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
  return intervals.map(int =>
    // To get the scale letters, we take the index of the root letter (eg C) and shift to right
    // by the sequence of the interval - 1 (which go from 1 to 7)
    // Pretty rudimentary but it seems to work
    alphabet.charAt((alphabet.indexOf(first) + int.seq - 1) % alphabet.length)
  )
}

function createScaleNotes(startingOrder: number, letters: string[], intervals: Interval[]) {
  return intervals.map((int, next) => {
    const targetNote = letters[next]
    // Convert the interval into semitones
    const semitones = intervalToSemitones(int)
    // Get the next note in order by summing the starting note's order and the added semitones
    const order = (startingOrder + semitones) % 12
    const note = NOTES[order]
    const n = note.note.charAt(0)
    // ['B', 'C', 'D♯', 'E♯', 'F♯♯', 'G♯♯', 'A♯'] enigmatic B
    // F < E [letters] -> false -> E#
    // G < F [letters] -> false -> F##
    // A < G [letters] -> true -> Gbbbbbb (G##)

    // [Eb, F, G, Ab, Bb, C, D] major Eb
    // G# < A [letters] -> false -> A####### (Ab)
    // (n === 'G' && letter === 'A') -> true -> Ab

    // [Ab, Bb, C, Db, Eb, F, G]
    // G# < A [letters] -> false -> A####### (Ab)
    // C# < D [letters] -> true -> Db
    //  && n !== 'A' && targetNote === 'G'
    if (
      (n < targetNote && (n !== 'A' || targetNote !== 'G')) ||
      (n === 'G' && targetNote === 'A')
    ) {
      // 'A' < 'B'
      let flats = 1
      let higher = NOTES[(order + flats) % 12]
      while (higher.note.charAt(0) !== targetNote) {
        flats += 1
        higher = NOTES[(order + flats) % 12]
      }
      // shift upwards -> key = Eb, note = G#, letter = A -> lower = G, higher = A -> Ab
      return {
        order,
        note: higher.note + '♭'.repeat(flats),
        flats: flats + (higher.note.includes('♭') ? 1 : 0),
        sharps: 0
      }
    } else if (n > targetNote || (n === 'A' && targetNote === 'G')) {
      // else if (n > letter || (n === 'A' && letter === 'G')) {
      // 'G' > 'F'
      let sharps = 1
      let lowerIndex = order === 0 ? NOTES.length - 1 : order - sharps
      let lower = NOTES[lowerIndex]
      while (lower.note.charAt(0) !== targetNote) {
        sharps += 1
        lowerIndex = lowerIndex === 0 ? NOTES.length - 1 : lowerIndex - 1
        lower = NOTES[lowerIndex]
      }
      // shift downwards -> key = F#, note = Bb -> lower = A, higher = C -> A#
      return {
        order,
        note: lower.note + '♯'.repeat(sharps),
        flats: 0,
        sharps: sharps + (lower.note.includes('♯') ? 1 : 0)
      }
    } else {
      // Correct letter
      return { order, note: note.note, flats: note.flats, sharps: note.sharps }
    }
  })
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
  const scaleNotes = createScaleNotes(foundRoot.order, letters, scale.intervals)
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
      scale: scale.names[0],
      names: scale.names,
      ...getKeySignature(scaleNotes),
      intervals: scale.intervals.map(int => ({ ...int })),
      triads: scale.triads.map(t => ({ ...t })),
      scaleNotes,
      notesMap
    }
  }
}

export function createScaleUnsafe(rawKey: string, scaleName: string): Scale {
  const scl = createScale(rawKey, scaleName)
  if ('err' in scl) {
    throw Error(scl.err)
  }
  return scl.data
}
