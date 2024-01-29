import type { Interval } from './types'

const regexPosInt = /^[0-9]$/

export function parseInteger(str: string) {
  try {
    return parseInt(str)
  } catch (err: any) {
    return 0
  }
}

export function createIntervals(intervals: readonly string[]): Interval[] {
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
    return { seq: parseInteger(intervalStr), flats, sharps }
  })
}
