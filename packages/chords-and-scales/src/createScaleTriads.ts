import { findChord } from './chords'
import { createInterval } from './intervals'

import type { Chord, Interval, ScaleTriad } from './types'

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

export function createTriadChords(triads: ScaleTriad[]): Chord[] {
  return triads.map(triad => {
    const intervals: Interval[] = [createInterval(1)]
    let chord
    if (triad.major) {
      intervals.push(createInterval(3))
      if (triad.suffix.startsWith('+')) {
        intervals.push(createInterval(5, 0, 1))
      } else if (triad.suffix.startsWith('6')) {
        intervals.push(createInterval(6))
      } else if (triad.suffix.startsWith('7')) {
        intervals.push(createInterval(7, 1))
      } else if (triad.suffix.startsWith('maj7')) {
        intervals.push(createInterval(7))
      } else {
        chord = findChord('maj')
      }
    } else if (triad.minor) {
      intervals.push(createInterval(3, 1))
      if (triad.suffix.startsWith('°')) {
        intervals.push(createInterval(5, 1))
      } else if (triad.suffix.startsWith('6')) {
        intervals.push(createInterval(6))
        chord = findChord('m' + triad.suffix)
      } else if (triad.suffix.startsWith('7')) {
        intervals.push(createInterval(7, 1))
        chord = findChord('m' + triad.suffix)
      } else {
        chord = findChord('m')
      }
    } else if (triad.suffix.startsWith('sus2')) {
      intervals.push(createInterval(2))
    } else if (triad.suffix.startsWith('sus4')) {
      intervals.push(createInterval(4))
    }
    if (intervals.length <= 2) {
      intervals.push(createInterval(5))
    }
    if (intervals.length <= 2) {
      intervals.push(createInterval(8))
    }
    if (!chord) {
      chord = findChord(triad.suffix)
    }
    return {
      ...(chord as Chord),
      intervals
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
  const len = intervals.length
  return intervals.map((int, i) => {
    const noteSemitones = int.semitones
    const foundSemitones = new Set<number>()
    for (let j = 1; j < len; j += 1) {
      const next = intervals[(i + j) % len].semitones
      const semiTones = next <= noteSemitones ? next + 12 - noteSemitones : next - noteSemitones
      foundSemitones.add(semiTones)
    }
    return getTriad(int.interval_seq, foundSemitones)
  })
}
