import { createChord } from './createChord'

import type { Interval, Scale, ScaleNote, ScaleTriad } from './types'

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
  const major = semitones.has(4) && semitones.has(7)
  const minor = semitones.has(3) && semitones.has(7)
  const sus2 = semitones.has(2)
  const sus4 = semitones.has(5)
  const dim = semitones.has(3) && semitones.has(6)
  const aug = semitones.has(4) && semitones.has(8)
  let num = toRomanNumeral(degree)
  let str = ''
  if (major) {
    // skip, already in uppercase
  } else if (minor) {
    num = num.toLowerCase()
  } else if (dim) {
    str = '°'
  } else if (aug) {
    str = '+'
  } else if (semitones.has(3) && semitones.has(10)) {
    num = num.toLowerCase()
    str = '7'
  } else if (semitones.has(4) && semitones.has(10)) {
    str = '7'
  } else if (semitones.has(4) && semitones.has(11)) {
    str = 'maj7'
  } else if (semitones.has(3) && semitones.has(8)) {
    num = num.toLowerCase()
    str = '6'
  } else if (semitones.has(4) && semitones.has(9)) {
    str = '6'
  } else if (sus2) {
    str = 'sus2'
  } else if (sus4) {
    str = 'sus4'
  } else if (semitones.has(7)) {
    str = '5'
  } else {
    str = '?'
  }
  return {
    parts: [num, str] as [string, string],
    degree,
    major,
    minor,
    semitones
  }
}

export function createScaleTriads(scaleNotes: ScaleNote[], intervals: Interval[]): ScaleTriad[] {
  const triads = []
  const len = intervals.length
  // debugger
  for (let i = 0; i < len; i += 1) {
    const note = scaleNotes[i]
    const foundSemitones = new Set<number>()
    let closestToThird = 11
    let closestToFifth = 11
    for (let j = 1; j < len; j += 1) {
      const next = scaleNotes[(i + j) % len]
      const curOrder =
        next.order <= note.order ? next.order + 12 - note.order : next.order - note.order
      if (Math.abs(closestToThird) > Math.abs(4 - curOrder)) {
        closestToThird = 4 - curOrder
      }
      if (Math.abs(closestToFifth) > Math.abs(7 - curOrder)) {
        closestToFifth = 7 - curOrder
      }
      foundSemitones.add(curOrder)
    }
    triads.push(getTriad(intervals[i].seq, foundSemitones))
  }
  return triads
}
