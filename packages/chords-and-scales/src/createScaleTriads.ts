import { createChord } from './createChord'

import type { Interval, Scale, ScaleNote, ScaleTriad } from './types'

function toRomanNumeral(seq: number) {
  return `${seq >= 5 ? 'V' : ''}${seq === 4 ? 'IV' : 'I'.repeat(seq % 5)}`
}

export function createTriadChords(triads: ScaleTriad[], scale: Scale) {
  return triads.map((triad, idx) => {
    const note = scale.scaleNotes[idx]
    const intervals = [{ str: '1', seq: 1, flats: 0, sharps: 0 }]
    if (triad.str.includes('sus2')) {
      intervals.push({ str: '2', seq: 4, flats: 0, sharps: 0 })
    } else if (triad.str.includes('sus4')) {
      intervals.push({ str: '4', seq: 4, flats: 0, sharps: 0 })
    } else {
      intervals.push({ str: '3', seq: 3, flats: triad.minor ? 1 : 0, sharps: 0 })
    }
    const flats = Array.from(triad.str.matchAll(/°/g)).length
    const sharps = Array.from(triad.str.matchAll(/\+/g)).length
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

export function createScaleTriads2(intervals: Interval[]): ScaleTriad[] {
  const triads: ScaleTriad[] = []
  return triads
}

export function createScaleTriads(scaleNotes: ScaleNote[], intervals: Interval[]): ScaleTriad[] {
  const triads = []
  const len = scaleNotes.length
  // debugger
  for (let i = 0; i < len; i += 1) {
    const note = scaleNotes[i]
    let third
    let fifth
    let closestToThird = 11
    let closestToFifth = 11
    for (let j = 1; j < len; j += 1) {
      const next = scaleNotes[(i + j) % len]
      const curOrder =
        next.order <= note.order ? next.order + 12 - note.order : next.order - note.order
      if (Math.abs(closestToThird) > Math.abs(4 - curOrder)) {
        third = next
        closestToThird = 4 - curOrder
      }
      if (Math.abs(closestToFifth) > Math.abs(7 - curOrder)) {
        fifth = next
        closestToFifth = 7 - curOrder
      }
    }
    const degree = intervals[i].seq
    const thirdSemitones = closestToThird + 4
    const fifthSemitones = closestToFifth + 7
    const major = closestToThird === 0
    const minor = closestToThird === 1
    const dim = closestToFifth === 1
    const perfect = closestToFifth === 0
    const aug = closestToFifth === -1
    const num = minor ? toRomanNumeral(degree).toLowerCase() : toRomanNumeral(degree)
    let str = ''
    if (closestToThird === 2) {
      str += 'sus2'
    } else if (closestToThird === -1) {
      str += 'sus4'
    }
    if (closestToFifth < 0) {
      str += '°'.repeat(Math.abs(closestToFifth))
    } else if (closestToFifth >= 2) {
      str += '6' + '+'.repeat(closestToFifth - 2)
    } else if (closestToFifth > 0) {
      str += '+'.repeat(closestToFifth)
    }
    triads.push({
      parts: [num, str] as [string, string],
      str: num + str,
      degree,
      major,
      minor,
      dim,
      perfect,
      aug,
      thirdSemitones,
      fifthSemitones
    })
  }
  return triads
}
