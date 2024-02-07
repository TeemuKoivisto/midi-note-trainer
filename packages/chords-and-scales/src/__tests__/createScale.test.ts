import { createScale } from '../createScale'

describe('createScale', () => {
  it('should generate all major scales correctly', () => {
    const correct = {
      C: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],

      // flats
      F: ['F', 'G', 'A', 'B♭', 'C', 'D', 'E'],
      'B♭': ['B♭', 'C', 'D', 'E♭', 'F', 'G', 'A'],
      'E♭': ['E♭', 'F', 'G', 'A♭', 'B♭', 'C', 'D'],
      'A♭': ['A♭', 'B♭', 'C', 'D♭', 'E♭', 'F', 'G'],
      'D♭': ['D♭', 'E♭', 'F', 'G♭', 'A♭', 'B♭', 'C'],
      'G♭': ['G♭', 'A♭', 'B♭', 'C♭', 'D♭', 'E♭', 'F'],
      'C♭': ['C♭', 'D♭', 'E♭', 'F♭', 'G♭', 'A♭', 'B♭'],
      'F♭': ['F♭', 'G♭', 'A♭', 'B♭♭', 'C♭', 'D♭', 'E♭'],

      // sharps
      G: ['G', 'A', 'B', 'C', 'D', 'E', 'F♯'],
      D: ['D', 'E', 'F♯', 'G', 'A', 'B', 'C♯'],
      A: ['A', 'B', 'C♯', 'D', 'E', 'F♯', 'G♯'],
      E: ['E', 'F♯', 'G♯', 'A', 'B', 'C♯', 'D♯'],
      B: ['B', 'C♯', 'D♯', 'E', 'F♯', 'G♯', 'A♯'],
      'F♯': ['F♯', 'G♯', 'A♯', 'B', 'C♯', 'D♯', 'E♯'],
      'C♯': ['C♯', 'D♯', 'E♯', 'F♯', 'G♯', 'A♯', 'B♯'],
      'G♯': ['G♯', 'A♯', 'B♯', 'C♯', 'D♯', 'E♯', 'F♯♯']
    }
    Object.entries(correct).forEach(([key, values]) => {
      const created = createScale(key, 'major')
      if ('err' in created) {
        expect(created.err).toEqual(undefined)
      } else {
        expect(created.data.scaleNotes.map(v => v.note)).toEqual(values)
      }
    })
    Object.entries(correct).forEach(([key, values]) => {
      const created = createScale(key, 'majorPentatonic')
      if ('err' in created) {
        expect(created.err).toEqual(undefined)
      } else {
        expect(created.data.scaleNotes.map(v => v.note)).toEqual(
          values.filter((_, idx) => idx !== 3 && idx !== values.length - 1)
        )
      }
    })
  })
  it('should generate all minor scales correctly', () => {
    const correct = {
      A: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],

      // flats
      D: ['D', 'E', 'F', 'G', 'A', 'B♭', 'C'],
      G: ['G', 'A', 'B♭', 'C', 'D', 'E♭', 'F'],
      C: ['C', 'D', 'E♭', 'F', 'G', 'A♭', 'B♭'],
      F: ['F', 'G', 'A♭', 'B♭', 'C', 'D♭', 'E♭'],
      'B♭': ['B♭', 'C', 'D♭', 'E♭', 'F', 'G♭', 'A♭'],
      'E♭': ['E♭', 'F', 'G♭', 'A♭', 'B♭', 'C♭', 'D♭'],
      'A♭': ['A♭', 'B♭', 'C♭', 'D♭', 'E♭', 'F♭', 'G♭'],
      'D♭': ['D♭', 'E♭', 'F♭', 'G♭', 'A♭', 'B♭♭', 'C♭'],

      // sharps
      E: ['E', 'F♯', 'G', 'A', 'B', 'C', 'D'],
      B: ['B', 'C♯', 'D', 'E', 'F♯', 'G', 'A'],
      'F♯': ['F♯', 'G♯', 'A', 'B', 'C♯', 'D', 'E'],
      'C♯': ['C♯', 'D♯', 'E', 'F♯', 'G♯', 'A', 'B'],
      'G♯': ['G♯', 'A♯', 'B', 'C♯', 'D♯', 'E', 'F♯'],
      'D♯': ['D♯', 'E♯', 'F♯', 'G♯', 'A♯', 'B', 'C♯'],
      'A♯': ['A♯', 'B♯', 'C♯', 'D♯', 'E♯', 'F♯', 'G♯'],
      'E♯': ['E♯', 'F♯♯', 'G♯', 'A♯', 'B♯', 'C♯', 'D♯']
    }
    Object.entries(correct).forEach(([key, values]) => {
      const created = createScale(key, 'minor')
      if ('err' in created) {
        expect(created.err).toEqual(undefined)
      } else {
        expect(created.data.scaleNotes.map(v => v.note)).toEqual(values)
      }
    })
    Object.entries(correct).forEach(([key, values]) => {
      const created = createScale(key, 'minorPentatonic')
      if ('err' in created) {
        expect(created.err).toEqual(undefined)
      } else {
        expect(created.data.scaleNotes.map(v => v.note)).toEqual(
          values.filter((_, idx) => idx !== 1 && idx !== values.length - 2)
        )
      }
    })
  })
  it('should generate all random scales correctly', () => {
    const correct = {
      dorian: {
        'D♯': ['D♯', 'E♯', 'F♯', 'G♯', 'A♯', 'B♯', 'C♯'],
        'A♯': ['A♯', 'B♯', 'C♯', 'D♯', 'E♯', 'F♯♯', 'G♯']
      },
      locrian: {
        'G♭': ['G♭', 'A♭♭', 'B♭♭', 'C♭', 'D♭♭', 'E♭♭', 'F♭']
      },
      mixolydianFlat6: {
        A: ['A', 'B', 'C♯', 'D', 'E', 'F', 'G'],
        E: ['E', 'F♯', 'G♯', 'A', 'B', 'C', 'D']
      },
      harmonicMinor: {
        A: ['A', 'B', 'C', 'D', 'E', 'F', 'G♯'],
        // should first generate minor scale and THEN augment seventh by 1 semitone
        G: ['G', 'A', 'B♭', 'C', 'D', 'E♭', 'F♯']
      },
      neapolitanMajor: {
        C: ['C', 'D♭', 'E♭', 'F', 'G', 'A', 'B'],
        F: ['F', 'G♭', 'A♭', 'B♭', 'C', 'D', 'E']
      },
      neapolitanMinor: {
        C: ['C', 'D♭', 'E♭', 'F', 'G', 'A♭', 'B'],
        F: ['F', 'G♭', 'A♭', 'B♭', 'C', 'D♭', 'E']
      },
      // prometheus C test
      bebopMajor: {
        'G♭': ['G♭', 'A♭', 'B♭', 'C♭', 'D♭', 'D', 'E♭', 'F']
      },
      bebopMinor: {
        'A♭': ['A♭', 'B♭', 'C♭', 'C', 'D♭', 'E♭', 'F', 'G♭']
      },
      bebopDominant: {
        // D-flat major scale with an added minor seventh
        'D♭': ['D♭', 'E♭', 'F', 'G♭', 'A♭', 'B♭', 'C♭', 'C']
      },
      hirojoshi: {
        'A♯': ['A♯', 'B♯', 'C♯', 'E♯', 'F♯']
      },
      persian: {
        C: ['C', 'D♭', 'E', 'F', 'G♭', 'A♭', 'B']
      },
      algerian: {
        'A♭': ['A♭', 'B♭', 'C♭', 'D♭', 'D', 'E♭', 'F♭', 'G'],
        'G♭': ['G♭', 'A♭', 'B♭♭', 'C♭', 'C', 'D♭', 'E♭♭', 'F']
      }
    }
    Object.entries(correct).forEach(([scale, values]) => {
      Object.entries(values).forEach(([key, notes]) => {
        const created = createScale(key, scale)
        if ('err' in created) {
          expect(created.err).toEqual(undefined)
        } else {
          expect(created.data.scaleNotes).toEqual(
            notes.map((n, idx) => ({
              note: n,
              order: created.data.scaleNotes[idx].order,
              flats: Array.from(n.matchAll(/♭/g)).length,
              sharps: Array.from(n.matchAll(/♯/g)).length
            }))
          )
        }
      })
    })
  })
})
