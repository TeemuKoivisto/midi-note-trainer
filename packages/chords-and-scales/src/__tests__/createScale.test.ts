import { createScale } from '../createScale'
import { FLAT_NOTES, SHARP_NOTES, MAJOR_KEY_MAP } from '../getKeySignature'

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
        const { scaleNotes } = created.data
        const flats = scaleNotes.reduce(
          (acc, cur) => acc + Array.from(cur.note.matchAll(/♭/g)).length,
          0
        )
        const sharps = scaleNotes.reduce(
          (acc, cur) => acc + Array.from(cur.note.matchAll(/♯/g)).length,
          0
        )
        const majorSignature =
          flats <= 7 && sharps <= 7 ? key : MAJOR_KEY_MAP.get(flats > sharps ? -7 : 7)
        expect({
          key,
          flats: Math.min(flats, 7),
          sharps: Math.min(sharps, 7),
          majorSignature,
          scaleNotes: scaleNotes.map(v => v.note)
        }).toEqual({
          key: created.data.key,
          flats: created.data.flats,
          sharps: created.data.sharps,
          majorSignature: created.data.majorSignature,
          scaleNotes: values
        })
      }
    })
    Object.entries(correct).forEach(([key, values]) => {
      const created = createScale(key, 'majorPentatonic')
      if ('err' in created) {
        expect(created.err).toEqual(undefined)
      } else {
        const { scaleNotes } = created.data
        expect(scaleNotes.map(v => v.note)).toEqual(
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
        const { scaleNotes } = created.data
        const flats = Math.min(
          scaleNotes.reduce((acc, cur) => acc + Array.from(cur.note.matchAll(/♭/g)).length, 0),
          7
        )
        const sharps = Math.min(
          scaleNotes.reduce((acc, cur) => acc + Array.from(cur.note.matchAll(/♯/g)).length, 0),
          7
        )
        const majorSignature = MAJOR_KEY_MAP.get(flats > sharps ? flats * -1 : sharps)
        expect({
          key,
          flats,
          sharps,
          majorSignature,
          scaleNotes: scaleNotes.map(v => v.note)
        }).toEqual({
          key: created.data.key,
          flats: created.data.flats,
          sharps: created.data.sharps,
          majorSignature: created.data.majorSignature,
          scaleNotes: values
        })
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
      melodicMinorAscending: {
        A: ['A', 'B', 'C', 'D', 'E', 'F♯', 'G♯']
      },
      melodicMinorDescending: {
        A: ['A', 'G', 'F', 'E', 'D', 'C', 'B', 'A']
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
      },
      chinese: {
        A: ['A', 'D♯', 'E', 'G♯']
      }
    }
    Object.entries(correct).forEach(([scale, values]) => {
      Object.entries(values).forEach(([key, notes]) => {
        const created = createScale(key, scale)
        if ('err' in created) {
          expect(created.err).toEqual(undefined)
        } else {
          const { key: createdKey, scaleNotes } = created.data
          let flats = 0
          let sharps = 0
          for (let i = 0; i < FLAT_NOTES.length; i += 1) {
            const flat = scaleNotes.find(n => n.note.slice(0, 2) === FLAT_NOTES[i])
            const sharp = scaleNotes.find(n => n.note.slice(0, 2) === SHARP_NOTES[i])
            if (flat && sharps === 0) {
              flats += 1
            } else if (sharp && flats === 0) {
              sharps += 1
            } else {
              break
            }
          }
          const majorSignature = MAJOR_KEY_MAP.get(
            flats > sharps ? Math.min(flats, 7) * -1 : Math.min(sharps, 7)
          )
          expect({ key, flats, sharps, majorSignature, scale, scaleNotes }).toEqual({
            key: createdKey,
            flats: created.data.flats,
            sharps: created.data.sharps,
            majorSignature: created.data.majorSignature,
            scale,
            scaleNotes: notes.map((n, idx) => ({
              note: n,
              order: scaleNotes[idx].order,
              flats: Array.from(n.matchAll(/♭/g)).length,
              sharps: Array.from(n.matchAll(/♯/g)).length
            }))
          })
        }
      })
    })
  })
})
