import { createChord } from './createChord'
import { intervalToSemitones } from './intervals'

import type { Interval, Scale, ScaleTriad } from './types'

function toRomanNumeral(seq: number) {
  return `${seq >= 5 ? 'V' : ''}${seq === 4 ? 'IV' : 'I'.repeat(seq % 5)}`
}

export function createTriadChords(triads: ScaleTriad[], scale: Scale) {
  return triads.map((triad, idx) => {
    const note = scale.scaleNotes[idx]
    const intervals = [{ str: '1', seq: 1, flats: 0, sharps: 0 }]
    if (triad.parts[1].includes('sus2')) {
      intervals.push({ str: '2', seq: 4, flats: 0, sharps: 0 })
    } else if (triad.parts[1].includes('sus4')) {
      intervals.push({ str: '4', seq: 4, flats: 0, sharps: 0 })
    } else {
      intervals.push({ str: '3', seq: 3, flats: triad.minor ? 1 : 0, sharps: 0 })
    }
    const flats = Array.from(triad.parts[1].matchAll(/°/g)).length
    const sharps = Array.from(triad.parts[1].matchAll(/\+/g)).length
    if (flats === 2) {
      intervals.push({
        str: '4',
        seq: 4,
        flats: 0,
        sharps: 0
      })
    } else if (sharps === 2) {
      intervals.push({
        str: '6',
        seq: 6,
        flats: 0,
        sharps: 0
      })
    } else {
      intervals.push({
        str: '5',
        seq: 5,
        flats,
        sharps
      })
    }
    return {
      chord: `${note.note}${triad.minor ? 'm' : ''}${triad.parts[1]}`,
      notes: createChord(note.order, scale, intervals)
    }
  })
}

export function getTriad(degree: number, semitones: Set<number>) {
  let major = semitones.has(4) && semitones.has(7)
  let minor = semitones.has(3) && semitones.has(7)
  const num = toRomanNumeral(degree)
  let mod = ''
  if (major || minor) {
    // Don't add modifiers for pure major/minor chords to distinguish them
    // from the less diatonic triads
  } else if (semitones.has(3) && semitones.has(6)) {
    mod = '°'
    minor = true
  } else if (semitones.has(4) && semitones.has(8)) {
    mod = '+'
    major = true
  } else if (semitones.has(3) && semitones.has(10)) {
    minor = true
    mod = '7'
  } else if (semitones.has(4) && semitones.has(10)) {
    mod = '7'
    major = true
  } else if (semitones.has(4) && semitones.has(11)) {
    mod = 'maj7'
    major = true
  } else if (semitones.has(3) && semitones.has(8)) {
    mod = '6'
    minor = true
  } else if (semitones.has(4) && semitones.has(9)) {
    mod = '6'
    major = true
  } else if (semitones.has(2)) {
    mod = 'sus2'
  } else if (semitones.has(5)) {
    mod = 'sus4'
  } else if (semitones.has(7)) {
    mod = '5'
  } else {
    mod = '?'
  }
  return {
    parts: [minor ? num.toLowerCase() : num, mod] as [string, string],
    degree,
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
