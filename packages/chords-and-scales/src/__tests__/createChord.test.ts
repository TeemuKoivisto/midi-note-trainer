import { Scale } from 'types'
import { chords } from '../chords'
import { createChord } from '../createChord'
import { createScale } from '../createScale'
import { NOTES, getRootNote } from '../utils'

describe('createChord', () => {
  it('should generate chords from root of C major scale', () => {
    const correct = {
      maj: ['C', 'E', 'G'],
      '6': ['C', 'E', 'G', 'A'],
      '6/9': ['C', 'E', 'G', 'A', 'D'],
      maj7: ['C', 'E', 'G', 'B'],
      maj9: ['C', 'E', 'G', 'B', 'D'],
      maj11: ['C', 'E', 'G', 'B', 'D', 'F'],
      maj13: ['C', 'E', 'G', 'B', 'D', 'F', 'A'],
      m: ['C', 'E♭', 'G'],
      m6: ['C', 'E♭', 'G', 'A'],
      m7: ['C', 'E♭', 'G', 'B♭'],
      m9: ['C', 'E♭', 'G', 'B♭', 'D'],
      m11: ['C', 'E♭', 'G', 'B♭', 'D', 'F'],
      m13: ['C', 'E♭', 'G', 'B♭', 'D', 'F', 'A'],
      sus2: ['C', 'D', 'G'],
      sus4: ['C', 'F', 'G'],
      '7sus4': ['C', 'F', 'G', 'B♭'],
      '7': ['C', 'E', 'G', 'B♭'],
      '7#9': ['C', 'E', 'G', 'B♭', 'D♯'],
      '9': ['C', 'E', 'G', 'B♭', 'D'],
      '11': ['C', 'E', 'G', 'B♭', 'D', 'F'],
      '13': ['C', 'E', 'G', 'B♭', 'D', 'F', 'A'],
      dim: ['C', 'E♭', 'G♭'],
      dim7: ['C', 'E♭', 'G♭', 'A'],
      m7b5: ['C', 'E♭', 'G♭', 'B♭'],
      '5': ['C', 'G'],
      aug: ['C', 'E', 'G♯'],
      aug7: ['C', 'E', 'G♯', 'B♭']
    }
    const created = createScale('C', 'major')
    if ('err' in created) {
      return expect(created.err).toEqual(undefined)
    }
    const scale = created.data
    const obj = Object.keys(correct).reduce(
      (acc, name) => {
        const chord = chords.get(name)
        if (!chord) {
          expect(chord).toBeTruthy()
        } else {
          const notes = createChord(0, scale, chord.intervals)
          acc[name] = notes.map(n => n.note)
        }
        return acc
      },
      {} as Record<string, string[]>
    )
    expect(obj).toEqual(correct)
  })
  it('should generate other chords from C major scale', () => {
    const correct = [
      ['A', 'maj', ['A', 'C♯', 'E']],
      ['A', 'maj13', ['A', 'C♯', 'E', 'G♯', 'B', 'D', 'F♯']],
      ['A', 'm', ['A', 'C', 'E']],
      ['A', 'm13', ['A', 'C', 'E', 'G', 'B', 'D', 'F♯']],
      ['A', '7#9', ['A', 'C♯', 'E', 'G', 'C']],
      ['A', 'm7b5', ['A', 'C', 'E♭', 'G']],
      ['A', 'aug7', ['A', 'C♯', 'F', 'G']],
      ['B♭', 'maj', ['B♭', 'D', 'F']],
      ['B♭', 'maj13', ['B♭', 'D', 'F', 'A', 'C', 'E♭', 'G']],
      ['B♭', 'm', ['B♭', 'D♭', 'F']],
      ['B♭', 'm13', ['B♭', 'D♭', 'F', 'A♭', 'C', 'E♭', 'G']],
      ['B♭', '7#9', ['B♭', 'D', 'F', 'A♭', 'C♯']],
      ['B♭', 'm7b5', ['B♭', 'D♭', 'E', 'A♭']],
      ['B♭', 'aug7', ['B♭', 'D', 'F♯', 'A♭']],
      ['B', 'maj13', ['B', 'E♭', 'F♯', 'B♭', 'C♯', 'E', 'G♯']],
      ['B', 'm13', ['B', 'D', 'F♯', 'A', 'C♯', 'E', 'G♯']],
      // F# is normally denoted as below, but since we are in C major we use the notes of the scale
      // ['F♯', 'maj13', ['F♯', 'A♯', 'C♯', 'E♯', 'G♯', 'B', 'D♯']],
      ['F♯', 'maj13', ['F♯', 'B♭', 'C♯', 'F', 'G♯', 'B', 'E♭']],
      ['F♯', 'm13', ['F♯', 'A', 'C♯', 'E', 'G♯', 'B', 'E♭']],
      ['F♯', 'm7b5', ['F♯', 'A', 'C', 'E']],
      ['F♯', 'aug7', ['F♯', 'B♭', 'D', 'E']]
    ] as [string, string, string[]][]

    const created = createScale('C', 'major')
    if ('err' in created) {
      return expect(created.err).toEqual(undefined)
    }
    const scale = created.data
    const obj = correct.reduce(
      (acc, val) => {
        const chord = chords.get(val[1])
        const note = NOTES.find(n => n.note === val[0])
        if (!chord || !note) {
          expect(chord).toBeTruthy()
          expect(note).toBeTruthy()
        } else {
          const notes = createChord(0 + note.order, scale, chord.intervals)
          acc.push([val[0], val[1], notes.map(n => n.note)])
        }
        return acc
      },
      [] as [string, string, string[]][]
    )
    expect(obj).toEqual(correct)
  })
  it('should generate chords from other major scales correctly', () => {
    const correct = {
      // E♭ F G A♭ B♭ C D
      'E♭': [['A♭', 'm13', ['A♭', 'C♭', 'E♭', 'G♭', 'B♭', 'C♯', 'F']]],
      // F♯, G♯, A♯, B, C♯, D♯, E♯
      'F♯': [
        ['F♯', 'maj', ['F♯', 'A♯', 'C♯']],
        ['F♯', 'maj13', ['F♯', 'A♯', 'C♯', 'E♯', 'G♯', 'B', 'D♯']],
        ['F♯', 'm13', ['F♯', 'A', 'C♯', 'E', 'G♯', 'B', 'D♯']],
        ['F♯', 'm7b5', ['F♯', 'A', 'C', 'E']],
        ['F♯', 'aug7', ['F♯', 'A♯', 'C♯♯', 'E']]
      ]
    } as Record<string, [string, string, string[]][]>

    const scales = Object.keys(correct).reduce(
      (acc, key) => {
        const scale = createScale(key, 'major')
        if ('err' in scale) {
          expect(scale.err).toEqual(undefined)
        } else {
          acc[key] = scale.data
        }
        return acc
      },
      {} as Record<string, Scale>
    )
    const obj = Object.entries(correct).reduce(
      (topLevel, entry) => {
        const scale = scales[entry[0]]
        topLevel[entry[0]] = entry[1].reduce(
          (acc, val) => {
            const chord = chords.get(val[1])
            const note = getRootNote(val[0])
            if (!chord || !note) {
              expect(chord).toBeTruthy()
              expect(note).toBeTruthy()
            } else {
              const notes = createChord(0 + note.order, scale, chord.intervals)
              notes.forEach(n => {
                expect(n.order).toBeGreaterThanOrEqual(0)
                expect(n.order).toBeLessThanOrEqual(11)
                expect({ note: n.note, order: n.order, flats: n.flats, sharps: n.sharps }).toEqual(
                  getRootNote(n.note)
                )
              })
              acc.push([val[0], val[1], notes.map(n => n.note)])
            }
            return acc
          },
          [] as [string, string, string[]][]
        )
        return topLevel
      },
      {} as Record<string, [string, string, string[]][]>
    )
    expect(obj).toEqual(correct)
  })
})
