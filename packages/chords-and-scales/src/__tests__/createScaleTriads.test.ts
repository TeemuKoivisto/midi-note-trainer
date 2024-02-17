import { createScaleTriads } from '../createScaleTriads'
import { findScale } from '../scales'

describe('createScaleTriads', () => {
  it("should generate modes' all diatonic triads correctly", () => {
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
        const triads = raw && createScaleTriads(raw.intervals)
        if (triads) {
          acc[scale] = triads.map(t => t.parts.join(''))
        }
        return acc
      },
      {} as Record<string, string[]>
    )
    expect(obj).toEqual(correct)
  })
})
