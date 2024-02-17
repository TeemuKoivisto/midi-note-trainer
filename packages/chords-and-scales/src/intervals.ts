import type { Interval } from './types'

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
