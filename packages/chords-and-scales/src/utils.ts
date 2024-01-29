import type { Interval } from './types'

const regexPosInt = /^[0-9]$/

export function parseInteger(str: string) {
  try {
    return parseInt(str)
  } catch (err: any) {
    return 0
  }
}

export function parseIntervals(intervals: readonly string[]): Interval[] {
  return intervals.map(str => {
    let intervalStr = ''
    let flats = 0
    let sharps = 0
    for (let j = 0; j < str.length; j += 1) {
      if (str[j] === 'b' || str[j] === '♭') {
        flats += 1
      } else if (str[j] === '#' || str[j] === '♯' || str[j] === 's') {
        sharps += 1
      } else if (regexPosInt.test(str[j])) {
        intervalStr += str[j]
      }
    }
    return { str, seq: parseInteger(intervalStr), flats, sharps }
  })
}

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
