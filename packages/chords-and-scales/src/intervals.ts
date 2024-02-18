import type { Interval } from './types'

const SEMI_TONES: Record<number, number> = {
  1: 0,
  2: 2,
  3: 4,
  4: 5,
  5: 7,
  6: 9,
  7: 11
}

export function createInterval(seq: number, flats: number = 0, sharps: number = 0) {
  return {
    interval: `${seq}${'♭'.repeat(flats)}${'♯'.repeat(sharps)}`,
    interval_seq: seq,
    semitones: intervalToSemitones(seq, flats, sharps),
    flats,
    sharps
  }
}

export function intervalToSemitones(seq: number, flats: number, sharps: number) {
  return (
    (seq < 8 ? SEMI_TONES[seq] : SEMI_TONES[seq % 7]) - flats + sharps + Math.floor(seq / 8) * 12
  )
}

export function intervalFromInteger(val: number): Interval {
  let seq
  let flats = 0
  let sharps = 0
  if (val < 0) {
    flats = 1 + Math.floor(-val / 100)
    seq = -val % 100
  } else if (val > 100) {
    sharps = Math.floor(val / 100)
    seq = val % 100
  } else {
    seq = val
  }
  const semitones = intervalToSemitones(seq, flats, sharps)
  return {
    interval: `${seq}${'♭'.repeat(flats)}${'♯'.repeat(sharps)}`,
    interval_seq: seq,
    semitones,
    flats,
    sharps
  }
}
