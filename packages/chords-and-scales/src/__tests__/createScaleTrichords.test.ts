import { createScaleTrichords } from '../createScaleTrichords'
import { findScale } from '../scales'

describe('createScaleTrichords', () => {
  it("should generate modes' all scale trichords correctly", () => {
    const correct = {
      ionian: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
      dorian: ['i', 'ii', 'III', 'IV', 'v', 'vi°', 'VII'],
      phrygian: ['i', 'II', 'III', 'iv', 'v°', 'VI', 'vii'],
      lydian: ['I', 'II', 'iii', 'iv°', 'V', 'vi', 'vii'],
      mixolydian: ['I', 'ii', 'iii°', 'IV', 'v', 'vi', 'VII'],
      aeolian: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'],
      locrian: ['i°', 'II', 'iii', 'iv', 'V', 'VI', 'vii']
    }
    const obj = Object.keys(correct).reduce(
      (acc, scale) => {
        const raw = findScale(scale)
        const trichords = raw && createScaleTrichords(raw.intervals)
        if (trichords) {
          acc[scale] = trichords.map(t => t.roman + t.suffix)
        }
        return acc
      },
      {} as Record<string, string[]>
    )
    expect(obj).toEqual(correct)
  })
})
