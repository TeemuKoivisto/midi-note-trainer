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

export function intervalToSemitones(interval: Interval) {
  return (
    (interval.seq < 8 ? SEMI_TONES[interval.seq] : SEMI_TONES[interval.seq % 7]) -
    interval.flats +
    interval.sharps +
    Math.floor(interval.seq / 8) * 12
  )
}

export function intervalFromJSON(val: number): Interval {
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
  return { str: `${seq}${'♭'.repeat(flats)}${'♯'.repeat(sharps)}`, seq, flats, sharps }
}
