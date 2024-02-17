import { createChord } from './createChord'
import { intervalToSemitones } from './intervals'

import type { Interval, Scale, ScaleTriad } from './types'

/**
 * Generates Roman numerals between 1-13
 * @param seq
 * @returns
 */
function toRomanNumeral(seq: number) {
  if (seq >= 9) {
    return `${seq >= 10 ? 'X' : ''}${seq === 9 ? 'IX' : 'I'.repeat(seq % 10)}`
  }
  return `${seq >= 5 ? 'V' : ''}${seq === 4 ? 'IV' : 'I'.repeat(seq % 5)}`
}

export function createTriadChords(triads: ScaleTriad[], scale: Scale) {
  return triads.map((triad, idx) => {
    const note = scale.scaleNotes[idx]
    const intervals = [{ str: '1', seq: 1, flats: 0, sharps: 0 }]
    if (triad.major) {
      intervals.push({ str: '3', seq: 3, flats: 0, sharps: 0 })
      if (triad.suffix.startsWith('+')) {
        intervals.push({ str: '5♯', seq: 5, flats: 0, sharps: 1 })
      } else if (triad.suffix.startsWith('6')) {
        intervals.push({ str: '6', seq: 6, flats: 0, sharps: 0 })
      } else if (triad.suffix.startsWith('7')) {
        intervals.push({ str: '7♭', seq: 7, flats: 1, sharps: 0 })
      } else if (triad.suffix.startsWith('maj7')) {
        intervals.push({ str: '7', seq: 7, flats: 0, sharps: 0 })
      }
    } else if (triad.minor) {
      intervals.push({ str: '3♭', seq: 3, flats: 1, sharps: 0 })
      if (triad.suffix.startsWith('°')) {
        intervals.push({ str: '5♭', seq: 5, flats: 0, sharps: 1 })
      } else if (triad.suffix.startsWith('6')) {
        intervals.push({ str: '6', seq: 6, flats: 0, sharps: 0 })
      } else if (triad.suffix.startsWith('7')) {
        intervals.push({ str: '7♭', seq: 7, flats: 1, sharps: 0 })
      }
    } else if (triad.suffix.startsWith('sus2')) {
      intervals.push({ str: '2', seq: 2, flats: 0, sharps: 0 })
    } else if (triad.suffix.startsWith('sus4')) {
      intervals.push({ str: '4', seq: 4, flats: 0, sharps: 0 })
    }
    if (intervals.length <= 2) {
      intervals.push({ str: '5', seq: 5, flats: 0, sharps: 0 })
    }
    return {
      chord: `${note.note}${!triad.suffix.includes('°') && triad.minor ? 'm' : ''}${triad.suffix}`,
      notes: createChord(note.order, scale, intervals)
    }
  })
}

export function getTriad(degree: number, semitones: Set<number>) {
  let major = semitones.has(4) && semitones.has(7)
  let minor = semitones.has(3) && semitones.has(7)
  const num = toRomanNumeral(degree)
  let suffix = ''
  if (major || minor) {
    // Don't add modifiers for pure major/minor chords to distinguish them
    // from the less diatonic triads
  } else if (semitones.has(3) && semitones.has(6)) {
    suffix = '°'
    minor = true
  } else if (semitones.has(4) && semitones.has(8)) {
    suffix = '+'
    major = true
  } else if (semitones.has(3) && semitones.has(10)) {
    minor = true
    suffix = '7'
  } else if (semitones.has(4) && semitones.has(10)) {
    suffix = '7'
    major = true
  } else if (semitones.has(4) && semitones.has(11)) {
    suffix = 'maj7'
    major = true
  } else if (semitones.has(3) && semitones.has(8)) {
    suffix = '6'
    minor = true
  } else if (semitones.has(4) && semitones.has(9)) {
    suffix = '6'
    major = true
  } else if (semitones.has(2)) {
    suffix = 'sus2'
  } else if (semitones.has(5)) {
    suffix = 'sus4'
  } else if (semitones.has(7)) {
    suffix = '5'
  } else {
    suffix = '?'
  }
  return {
    degree,
    roman: minor ? num.toLowerCase() : num,
    suffix,
    major,
    minor,
    semitones
  }
}

export function createScaleTriads(intervals: Interval[]): ScaleTriad[] {
  const triads = []
  const len = intervals.length
  for (let i = 0; i < len; i += 1) {
    const noteSemitones = intervalToSemitones(intervals[i])
    const foundSemitones = new Set<number>()
    for (let j = 1; j < len; j += 1) {
      const next = intervalToSemitones(intervals[(i + j) % len])
      const semiTones = next <= noteSemitones ? next + 12 - noteSemitones : next - noteSemitones
      foundSemitones.add(semiTones)
    }
    triads.push(getTriad(intervals[i].seq, foundSemitones))
  }
  return triads
}
